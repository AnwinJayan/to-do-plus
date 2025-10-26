import { Request, Response } from "express";
import Task from "../models/Task";
import List from "../models/List";
import { StatusCodes } from "http-status-codes";
import Errors from "../utils/AppError";
import {
  TaskSchema,
  createTaskSchema,
  updateTaskSchema,
} from "../types/taskTypes";
import { MongoIdSchema } from "../types/commonTypes";

// Create Task
export const createTask = async (req: Request, res: Response) => {
  const taskData = createTaskSchema.parse(req.body);
  const userId = req.user?.userId;
  // Ensure list exists and belongs to user
  const list = await List.findOne({ _id: taskData.listId, userId });
  if (!list) throw new Errors.NotFoundError("List not found");
  // Find max position in list for this user
  const maxTask = await Task.findOne({ listId: taskData.listId, userId }).sort(
    "-position"
  );
  const position = maxTask ? maxTask.position + 1 : 0;
  const task = await Task.create({ ...taskData, userId, position });
  res.status(StatusCodes.CREATED).json({
    message: "Task created successfully",
    task,
  });
};

// Get tasks by list
export const getTasksByList = async (req: Request, res: Response) => {
  const { listId } = req.params;
  const userId = req.user?.userId;
  // Validate list exists and belongs to user
  const list = await List.findOne({ _id: listId, userId });
  if (!list) throw new Errors.NotFoundError("List not found");
  // Sort by position ascending
  const tasks = await Task.find({ listId, userId }).sort({ position: 1 });
  res.status(StatusCodes.OK).json({
    message: "Tasks retrieved successfully",
    tasks,
  });
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response) => {
  const { id } = MongoIdSchema.parse(req.params);
  const userId = req.user?.userId;
  const task = await Task.findOne({ _id: id, userId });
  if (!task) throw new Errors.NotFoundError("Task not found");
  res.status(StatusCodes.OK).json({
    message: "Task retrieved successfully",
    task,
  });
};

// Update task (partial)
export const updateTask = async (req: Request, res: Response) => {
  const { id } = MongoIdSchema.parse(req.params);
  const updateData = updateTaskSchema.parse(req.body);
  const userId = req.user?.userId;
  const task = await Task.findOne({ _id: id, userId });
  if (!task) throw new Errors.NotFoundError("Task not found");

  // If position is updated, maintain sort order and clamp position
  if (
    updateData.position !== undefined &&
    updateData.position !== task.position
  ) {
    // Get all tasks in the list
    const tasks = await Task.find({ listId: task.listId, userId }).sort({
      position: 1,
    });
    const maxPosition = tasks.length - 1;
    let newPos = updateData.position;
    // Clamp newPos to [0, maxPosition]
    if (newPos < 0) newPos = 0;
    if (newPos > maxPosition) newPos = maxPosition;

    // Remove task from array and insert at new position
    const reordered = tasks.filter(
      (t: any) => String(t._id) !== String(task._id)
    );
    reordered.splice(newPos, 0, task);
    // Update positions
    for (let i = 0; i < reordered.length; i++) {
      await Task.findByIdAndUpdate(reordered[i]._id, { position: i });
    }
    updateData.position = newPos;
  }

  const updated = await Task.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({
    message: "Task updated successfully",
    task: updated,
  });
};

// Delete task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = MongoIdSchema.parse(req.params);
  const userId = req.user?.userId;
  const task = await Task.findOneAndDelete({ _id: id, userId });
  if (!task) throw new Errors.NotFoundError("Task not found");
  // After delete, reindex positions in the list
  const tasks = await Task.find({ listId: task.listId, userId }).sort({
    position: 1,
  });
  for (let i = 0; i < tasks.length; i++) {
    await Task.findByIdAndUpdate(tasks[i]._id, { position: i });
  }
  res.status(StatusCodes.NO_CONTENT).send();
};

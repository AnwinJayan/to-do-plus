import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import List from "../models/List";
import Task from "../models/Task";
import Errors from "../utils/AppError";
import {
  createListSchema,
  updateListSchema,
  AiListResponseSchema,
  listQuerySchema,
  ListQueryInput,
} from "../types/listTypes";
import { MongoIdSchema } from "../types/commonTypes";
import { generateList } from "../services/aiService";
import { z } from "zod";

// Create List (manual)
export const createList = async (req: Request, res: Response) => {
  const listData = createListSchema.parse(req.body);
  const userId = req.user?.userId;
  const existing = await List.findOne({ title: listData.title, userId });
  if (existing) throw new Errors.BadRequestError("List title must be unique");
  const list = await List.create({ ...listData, userId });
  res.status(StatusCodes.CREATED).json({
    message: "List created successfully",
    list,
  });
};

// Create List with AI
export const createListWithAI = async (req: Request, res: Response) => {
  const { prompt } = z
    .object({
      prompt: z.string().min(1, "Prompt is required for AI-generated lists"),
    })
    .parse(req.body);
  const userId = req.user?.userId;
  const aiResult = AiListResponseSchema.parse(await generateList(prompt));
  console.log("AI-generated list result:", aiResult);
  if (aiResult.status === "ERROR") {
    throw new Errors.BadRequestError(aiResult.message);
  }
  const list = await List.create({
    title: aiResult.title,
    userId,
    isFavorited: false,
  });
  // Optionally, create tasks for the list
  if (Array.isArray(aiResult.tasks)) {
    await Task.insertMany(
      aiResult.tasks.map((title: string, idx: number) => ({
        title,
        listId: list._id,
        userId,
        position: idx,
      }))
    );
  }
  res.status(StatusCodes.CREATED).json({
    message: aiResult.message || "AI-generated list created successfully",
    list,
  });
};

// Get all lists for user
export const getUserLists = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  // Parse and validate query params
  const queryInput: ListQueryInput = listQuerySchema.parse(req.query);

  // Build Mongo query
  const mongoQuery: any = { userId };
  console.log("Mongo query:", queryInput);
  if (queryInput.isFavorited === "true") {
    console.log("isFavorited filter applied:", queryInput.isFavorited);
    mongoQuery.isFavorited = queryInput.isFavorited;
  }
  if (queryInput.search) {
    mongoQuery.title = { $regex: new RegExp(queryInput.search, "i") };
  }

  // Pagination
  const page = queryInput.page || 1;
  const limit = queryInput.limit || 10;
  let dbQuery = List.find(mongoQuery)
    .skip((page - 1) * limit)
    .limit(limit);

  // Sorting
  if (queryInput.sort) {
    // Support comma-separated sort fields, e.g. "-created_at,title"
    const sortObj: Record<string, 1 | -1> = {};
    queryInput.sort.split(",").forEach((field) => {
      if (field.startsWith("-")) {
        sortObj[field.substring(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });
    dbQuery = dbQuery.sort(sortObj);
  }

  const lists = await dbQuery;
  res.status(StatusCodes.OK).json({
    message: "Lists retrieved successfully",
    lists,
  });
};

// Get list by ID
export const getListById = async (req: Request, res: Response) => {
  const { id } = MongoIdSchema.parse(req.params);
  const userId = req.user?.userId;
  const list = await List.findOne({ _id: id, userId });
  if (!list) throw new Errors.NotFoundError("List not found");
  res.status(StatusCodes.OK).json({
    message: "List retrieved successfully",
    list,
  });
};

// Update list
export const updateList = async (req: Request, res: Response) => {
  const { id } = MongoIdSchema.parse(req.params);
  const updateData = updateListSchema.parse(req.body);
  const userId = req.user?.userId;
  const list = await List.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!list) throw new Errors.NotFoundError("List not found");
  res.status(StatusCodes.OK).json({
    message: "List updated successfully",
    list,
  });
};

// Delete list
export const deleteList = async (req: Request, res: Response) => {
  const { id } = MongoIdSchema.parse(req.params);
  const userId = req.user?.userId;
  const list = await List.findOneAndDelete({ _id: id, userId });
  if (!list) throw new Errors.NotFoundError("List not found");
  res.status(StatusCodes.NO_CONTENT).send();
};

// Delete all lists for user
export const deleteAllLists = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  await List.deleteMany({ userId });
  res.status(StatusCodes.NO_CONTENT).send();
};

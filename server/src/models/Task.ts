import mongoose, { Schema, model, Document } from "mongoose";

export interface ITask extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  listId: mongoose.Schema.Types.ObjectId;
  title: string;
  completed: boolean;
  position: number;
  created_at: Date;
  modified_at: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: [true, "List ID is required"],
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title must not exceed 200 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      required: [true, "Task position is required"],
      min: [0, "Position must be a non-negative number"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    modified_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;

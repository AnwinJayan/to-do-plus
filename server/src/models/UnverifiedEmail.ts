import mongoose, { Document, Schema } from "mongoose";

export interface IUnverifiedEmail extends Document {
  email: string;
  clerkId: string;
  createdAt: Date;
}

const UnverifiedEmailSchema = new Schema<IUnverifiedEmail>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    clerkId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUnverifiedEmail>(
  "UnverifiedEmail",
  UnverifiedEmailSchema
);

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import Bag from "./Bag.js"; // Add this import
import { deleteImage } from "../services/imageUploadService.js";
import { clerkClient } from "../services/clerkClient.js";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  clerkId: string;
  username: string;
  email: string;
  role: string;
  isSuspended: boolean;
  suspensionReason?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email!`,
      },
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    isSuspended: {
      type: Boolean,
      required: true,
      default: false,
    },
    suspensionReason: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

import List from "./List.js";
import Task from "./Task.js";

UserSchema.pre("findOneAndDelete", async function (next) {
  const filter = this.getQuery();
  const user = await this.model.findOne(filter).select("_id imageUrl clerkId");
  if (user) {
    await clerkClient.users.deleteUser(user.clerkId);
    if (user.imageUrl) {
      await deleteImage({ url: user.imageUrl, provider: "cloudinary" });
    }
    // Delete all lists and tasks for this user
    await List.deleteMany({ userId: user._id });
    await Task.deleteMany({ userId: user._id });
  }
  next();
});

UserSchema.pre("deleteMany", async function (next) {
  const filter = this.getFilter();
  const users = await this.model.find(filter).select("_id imageUrl clerkId");
  for (const user of users) {
    if (user.imageUrl) {
      await clerkClient.users.deleteUser(user.clerkId);
      await deleteImage({ url: user.imageUrl, provider: "cloudinary" });
    }
  }
  const userIds = users.map((u: any) => u._id);
  if (userIds.length > 0) {
    await List.deleteMany({ userId: { $in: userIds } });
    await Task.deleteMany({ userId: { $in: userIds } });
  }
  next();
});

export default mongoose.model<IUser>("User", UserSchema);

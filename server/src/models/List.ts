import mongoose, { Schema, model, Document } from "mongoose";
import Task from "./Task.js";

export interface IList extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  isFavorited: boolean;
  created_at: Date;
  modified_at: Date;
}

const listSchema = new Schema<IList>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "List title is required"],
      trim: true,
      maxlength: [100, "List title must not exceed 100 characters"],
    },
    isFavorited: {
      type: Boolean,
      default: false,
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

// Cascade delete tasks when a list is removed
listSchema.pre("findOneAndDelete", async function (next) {
  const listId = this.getQuery()["_id"];
  await Task.deleteMany({ listId });
  next();
});

listSchema.pre("deleteMany", async function (next) {
  const filter = this.getFilter();
  const lists = await this.model.find(filter);
  const listIds = lists.map((list: any) => list._id);
  await Task.deleteMany({ listId: { $in: listIds } });
  next();
});

const List = model<IList>("List", listSchema);

export default List;

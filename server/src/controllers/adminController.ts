import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
// ...existing code...
import Errors from "../utils/AppError.js";
import { userIdParamSchema } from "../types/userTypes.js";
import { suspensionRequestSchema } from "../types/adminTypes.js";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.status(StatusCodes.OK).json({
    message: "Users retrieved successfully",
    users,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = userIdParamSchema.parse(req.params);
  const user = await User.findById(id).select("-password");
  if (!user) throw new Errors.NotFoundError("User not found");
  res.status(StatusCodes.OK).json({
    message: "User retrieved successfully",
    user,
  });
};

export const makeUserAdminById = async (req: Request, res: Response) => {
  const { id } = userIdParamSchema.parse(req.params);
  const user = await User.findById(id);
  if (!user) throw new Errors.NotFoundError("User not found");
  if (id === req.user?.userId) {
    throw new Errors.ForbiddenError(
      "You cannot make yourself an admin via this endpoint"
    );
  }
  user.role = "admin";
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "User made admin successfully",
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
};

export const revokeUserAdminById = async (req: Request, res: Response) => {
  const { id } = userIdParamSchema.parse(req.params);
  const user = await User.findById(id);
  if (!user) throw new Errors.NotFoundError("User not found");
  if (id === req.user?.userId) {
    throw new Errors.ForbiddenError(
      "You cannot revoke your own admin privileges via this endpoint"
    );
  }
  if (user.role !== "admin") {
    throw new Errors.BadRequestError("User is not an admin");
  }
  user.role = "user";
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "User admin privileges revoked successfully",
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
};

export const suspendUserById = async (req: Request, res: Response) => {
  const { id } = userIdParamSchema.parse(req.params);
  const { reason } = suspensionRequestSchema.parse(req.body);
  const user = await User.findById(id);
  if (!user) throw new Errors.NotFoundError("User not found");
  if (id === req.user?.userId) {
    throw new Errors.ForbiddenError(
      "You cannot suspend your own account via this endpoint"
    );
  }
  user.isSuspended = true;
  user.suspensionReason = reason;
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "User suspended successfully",
    user: {
      id: user._id,
      username: user.username,
      isSuspended: user.isSuspended,
    },
  });
};

// Unsuspend a user by ID
export const unsuspendUserById = async (req: Request, res: Response) => {
  const { id } = userIdParamSchema.parse(req.params);
  const user = await User.findById(id);
  if (!user) throw new Errors.NotFoundError("User not found");
  user.isSuspended = false;
  user.suspensionReason = undefined; // Clear the suspension reason
  await user.save();
  res.status(StatusCodes.OK).json({
    message: "User unsuspended successfully",
    user: {
      id: user._id,
      username: user.username,
      isSuspended: user.isSuspended,
    },
  });
};

// Delete a single user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = userIdParamSchema.parse(req.params);
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Errors.NotFoundError("User not found");
  if (id === req.user?.userId) {
    throw new Errors.ForbiddenError(
      "You cannot delete your own account via this endpoint"
    );
  }
  res.status(StatusCodes.NO_CONTENT).send();
};

// Delete all users
export const deleteAllUsers = async (req: Request, res: Response) => {
  const adminId = req.user?.userId;
  await User.deleteMany({ _id: { $ne: adminId } });
  res.status(StatusCodes.NO_CONTENT).send();
};

// ...existing code...

// Delete all bags
// ...existing code...

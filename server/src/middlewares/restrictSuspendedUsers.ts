import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import Errors from "../utils/AppError.js";

const restrictSuspendedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user?.userId).select(
    "isSuspended suspensionReason"
  );

  if (!user) {
    return next(new Errors.UnauthorizedError("User not found"));
  }

  if (user.isSuspended) {
    return next(
      new Errors.ForbiddenError(
        `Your account is suspended. Reason: ${
          user.suspensionReason || "No reason provided"
        }`
      )
    );
  }

  next();
};

export default restrictSuspendedUsers;

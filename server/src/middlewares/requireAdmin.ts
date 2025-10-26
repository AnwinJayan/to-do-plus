import { Request, Response, NextFunction } from "express";
import Errors from "../utils/AppError.js";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    throw new Errors.ForbiddenError(
      "You do not have permission to access this resource."
    );
  }
  next();
};

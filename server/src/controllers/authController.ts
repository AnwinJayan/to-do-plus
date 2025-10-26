import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Errors from "../utils/AppError.js";

// Test Authentication Controller
export const testAuth = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new Errors.UnauthorizedError("User not authenticated");
  res.status(StatusCodes.OK).json({ user });
};

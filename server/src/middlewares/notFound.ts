import Errors from "../utils/AppError.js";
import { Request, Response, NextFunction } from "express";

const notFoundMiddleware: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = (req, res, next) => {
  throw new Errors.NotFoundError(`Not Found - ${req.originalUrl}`);
};

export default notFoundMiddleware;

import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error("Error:", err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      code: 422,
      message: err.errors
        .map((e) => `[${e.message}: ${e.path.join(" ")}]`)
        .join(", "),
    });
    return;
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(", ");
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ code: StatusCodes.BAD_REQUEST, message });
    return;
  }

  if (err.code && err.code === 11000) {
    const message =
      // err.message ||
      `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field, please choose another value`;
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ code: StatusCodes.BAD_REQUEST, message });
    return;
  }

  if (err.name === "CastError") {
    const message = err.message || `No item found with id: ${err.value}`;
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ code: StatusCodes.NOT_FOUND, message });
    return;
  }

  console.error("Unexpected error:", err);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  });
};

export default errorHandler;

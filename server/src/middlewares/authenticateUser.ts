// Authenticate user middleware
import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { findOrCreateUserByClerkId } from "../utils/userUtils.js";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    // console.log("Authentication middleware triggered", auth);
    if (!auth?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    // Attach userId to request for further use
    const { userId, role } = await findOrCreateUserByClerkId(auth.userId);
    req.user = { userId, clerkId: auth.userId, role };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

export default authenticateUser;

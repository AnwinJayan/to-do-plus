import User from "../models/User.js";
import Errors from "../utils/AppError.js";
import { clerkClient } from "@clerk/express";

class AuthService {
  async register(clerkId: string): Promise<string> {
    // this is only called if user is not registered in the database
    const clerkUser = await clerkClient.users.getUser(clerkId);
    if (!clerkUser) {
      throw new Errors.NotFoundError("Clerk user not found");
    }
    const user = await User.create({
      clerkId,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      username: clerkUser.username,
    });

    return String(user._id);
  }
}

export default new AuthService();

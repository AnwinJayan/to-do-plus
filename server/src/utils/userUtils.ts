import User from "../models/User.js";
import authService from "../services/authService.js";

export async function findOrCreateUserByClerkId(
  clerkId: string
): Promise<{ userId: string; role: string }> {
  let user = await User.findOne({ clerkId });
  if (user) {
    return { userId: String(user._id), role: user.role };
  }
  const userId = await authService.register(clerkId);
  return { userId, role: "user" };
}

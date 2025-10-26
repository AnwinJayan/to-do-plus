import { Request, Response } from "express";
import User from "../models/User.js";
import UnverifiedEmail from "../models/UnverifiedEmail.js";
import { StatusCodes } from "http-status-codes";
import Errors from "../utils/AppError.js";
import {
  updateProfileImageSchema,
  updatePasswordSchema,
  userIdParamSchema,
  updateUsernameSchema,
} from "../types/userTypes.js";
import { UserPayload } from "../types/userTypes.js";
import { uploadImage, deleteImage } from "../services/imageUploadService.js";
import { clerkClient } from "../services/clerkClient.js";
import { z } from "zod";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}

export const getMyDetails = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const user = await User.findById(userId);
  if (!user) throw new Errors.NotFoundError("User not found");
  res.status(StatusCodes.OK).json({
    message: "User details retrieved successfully",
    user,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = userIdParamSchema.parse(req.params);
  const user = await User.findById(id);
  if (!user) throw new Errors.NotFoundError("User not found");
  res.status(StatusCodes.OK).json({
    message: "User details retrieved successfully",
    user,
  });
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const { userId, clerkId } = req.user;
    const { username } = updateUsernameSchema.parse(req.body);
    const clerkUser = await clerkClient.users.getUser(clerkId);
    if (!clerkUser) throw new Errors.NotFoundError("Clerk user not found");
    await clerkClient.users.updateUser(clerkId, { username });
    const mongoUser = await User.findById(userId);
    if (!mongoUser) throw new Errors.NotFoundError("User not found");
    mongoUser.username = username;
    await mongoUser.save();
    res.status(200).json({ message: "Username updated successfully." });
  } catch (err: any) {
    if (err.errors?.[0]?.code === "form_identifier_exists") {
      throw new Errors.ConflictError("Username already taken");
    }
    throw err;
  }
};

export const setUnverifiedEmail = async (req: Request, res: Response) => {
  const { clerkId } = req.user;
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const now = new Date();
  const existing = await UnverifiedEmail.findOne({ clerkId, email });

  if (existing) {
    const ageMs = now.getTime() - existing.createdAt.getTime();
    // if (ageMs <= 5 * 60 * 1000) {
    //   res.status(200).json({ message: "OK" });
    //   return;
    // }

    const user = await clerkClient.users.getUser(clerkId);
    const isPrimary = user.primaryEmailAddressId === existing.email; // compare IDs below

    await UnverifiedEmail.deleteOne({ clerkId, email });

    if (isPrimary) {
      res.status(200).json({ message: "Deleted cache; primary email resets" });
      return;
    }

    // Remove from Clerk
    const addr = user.emailAddresses.find((e) => e.emailAddress === email);
    if (addr) await clerkClient.emailAddresses.deleteEmailAddress(addr.id);
    res.status(200).json({ message: "Deleted cache and removed email" });
    return;
  }

  // Create new unverified email record
  await UnverifiedEmail.create({ clerkId, email });
  res.status(200).json({ message: "Cached unverified email successfully" });
};

export const promoteVerifiedEmail = async (req: Request, res: Response) => {
  const { clerkId, userId } = req.user;
  const { email } = z
    .object({
      email: z.string().email("Invalid email format"),
    })
    .parse(req.body);
  // Step 1: Fetch user
  const user = await clerkClient.users.getUser(clerkId);
  if (!user) throw new Errors.NotFoundError("User not found");

  // Step 2: Find email in Clerk
  const emailObj = user.emailAddresses.find((e) => e.emailAddress === email);

  if (!emailObj) {
    throw new Errors.NotFoundError("Email not found in Clerk user");
  }

  if (emailObj.verification?.status !== "verified") {
    throw new Errors.ConflictError("Email is not verified");
  }

  // Step 4: Delete unverified email record from your DB
  await UnverifiedEmail.findOneAndDelete({ email, clerkId });

  // Step 5: Set verified email as primary
  await clerkClient.users.updateUser(clerkId, {
    primaryEmailAddressID: emailObj.id,
  });
  await User.findByIdAndUpdate(userId, {
    email: emailObj.emailAddress,
  });
  for (const ext of user.externalAccounts) {
    try {
      await clerkClient.users.deleteUserExternalAccount({
        userId: clerkId,
        externalAccountId: ext.id, // MUST be correct
      });
    } catch (err: any) {
      if (
        err.clerkError &&
        err.status === 404 &&
        err.errors?.[0]?.code === "external_account_not_found"
      ) {
        console.warn(`External account ${ext.id} not found; skipping unlink.`);
      } else {
        throw err;
      }
    }
  }
  const otherEmailIds = user.emailAddresses
    .filter((e) => e.id !== emailObj.id)
    .map((e) => e.id);
  await Promise.all(
    otherEmailIds.map((id) => clerkClient.emailAddresses.deleteEmailAddress(id))
  );

  res.status(200).json({ message: "Email reset successfully" });
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.user;
    const user = await clerkClient.users.getUser(clerkId);
    if (!user) throw new Errors.NotFoundError("User not found");

    const { currentPassword, newPassword } = updatePasswordSchema.parse(
      req.body
    );

    if (user.passwordEnabled && !currentPassword) {
      throw new Errors.BadRequestError(
        "Current password is required when password is enabled"
      );
    }
    if (user.passwordEnabled) {
      await clerkClient.users.verifyPassword({
        userId: clerkId,
        password: currentPassword!,
      });
    }

    // Update or set the new password
    await clerkClient.users.updateUser(clerkId, {
      password: newPassword,
    });

    res.status(200).json({
      message: user.passwordEnabled ? "Password updated." : "Password set.",
    });
  } catch (err: any) {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.errors?.[0]?.message ?? err.message });
  }
};

export const updateProfileImage = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new Errors.UnauthorizedError("Not authenticated");
  const user = await User.findById(userId);
  if (!user) throw new Errors.NotFoundError("User not found");
  const parsedBody = updateProfileImageSchema.parse(req.body);
  if (req.file) {
    if (user.imageUrl) {
      await deleteImage({ url: user.imageUrl, provider: "cloudinary" });
    }
    const imageUrl = await uploadImage({ file: req.file });
    user.imageUrl = imageUrl;
  } else if (req.body.image === "null" && user.imageUrl) {
    await deleteImage({ url: user.imageUrl, provider: "cloudinary" });
    user.imageUrl = undefined;
  }

  await user.save();

  res.status(StatusCodes.OK).json({
    message: "Profile image updated successfully",
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { clerkId, userId } = req.user;
  if (!userId) throw new Errors.UnauthorizedError("Not authenticated");
  const user = await User.findById(userId);
  if (!user) throw new Errors.NotFoundError("User not found");
  await User.findByIdAndDelete(userId);
  res.status(StatusCodes.OK).json({
    message: "User deleted successfully",
  });
};

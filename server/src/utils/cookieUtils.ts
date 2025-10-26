import { Response } from "express";
import config from "../config/index.js";

export function attachJwtCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    maxAge: config.cookie.maxAge,
    sameSite: "lax",
  });
}

export function clearJwtCookie(res: Response) {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: config.nodeEnv === "production",
  });
}

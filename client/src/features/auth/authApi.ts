import api from "../../lib/axios";
import { handleApiRequest } from "../../lib/apiUtils";
import { AuthResponseSchema, AuthResponse } from "./authTypes";
import { ToastOptionsSchema } from "../../lib/apiUtils";

export const testAuth = async (
  toastOptions?: ToastOptionsSchema
): Promise<AuthResponse> => {
  const response = await handleApiRequest<AuthResponse>(
    api.get("/auth/test"),
    "Failed to test authentication",
    "Authentication test successful",
    toastOptions
  );
  return AuthResponseSchema.parse(response);
};

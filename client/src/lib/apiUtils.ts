import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export interface ToastOptionsSchema {
  showSuccessMessage?: boolean; // Option to toggle success message
  showErrorMessage?: boolean; // Option to toggle error message
}

export const handleApiRequest = async <T>(
  request: Promise<AxiosResponse<T>>,
  customErrorMessage?: string,
  successMessage?: string,
  options: ToastOptionsSchema = {
    showErrorMessage: true,
    showSuccessMessage: false,
  }
): Promise<T> => {
  try {
    const response = await request;
    if (successMessage && options.showSuccessMessage) {
      toast.success(successMessage);
    }
    return response.data;
  } catch (error: any) {
    console.error("API request failed:", error);
    // Handle error response and extract message
    const errorMessage =
      error.response?.data?.message ||
      customErrorMessage ||
      "An error occurred";
    if (options?.showErrorMessage) {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage);
  }
};

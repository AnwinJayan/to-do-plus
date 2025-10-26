import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserThunk } from "../userSlice";
import { useUser } from "@clerk/clerk-react";
import { updatePassword } from "../userApi";
import { updatePasswordSchema, UpdatePassword } from "../userTypes";
import GenericForm, {
  GenericFieldConfig,
} from "../../common/components/GenericForm";

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { user } = useUser();
  const fields: GenericFieldConfig[] = [
    user?.passwordEnabled
      ? {
          name: "currentPassword",
          label: "Current Password",
          type: "password",
          required: true,
        }
      : undefined,
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      required: true,
    },
  ].filter(Boolean) as GenericFieldConfig[];

  const handleSubmit = async (data: UpdatePassword) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updatePassword(data, {
        showSuccessMessage: true,
        showErrorMessage: true,
      });
      user?.reload();
      dispatch(fetchUserThunk() as any);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericForm<UpdatePassword>
      fields={fields}
      schema={updatePasswordSchema}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Change Password"
      externalError={error || undefined}
    />
  );
}

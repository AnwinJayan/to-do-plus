import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { UpdateUsername, UpdateUsernameSchema } from "../userTypes";
import { updateUsername } from "../userApi";
import { useDispatch } from "react-redux";
import { fetchUserThunk } from "../userSlice";
import GenericForm, {
  GenericFieldConfig,
} from "../../common/components/GenericForm";

const fields: GenericFieldConfig[] = [
  { name: "username", label: "New Username", type: "text", required: true },
];

export default function ChangeUserNameForm() {
  const user = useSelector((state: RootState) => state.user);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (data: UpdateUsername) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateUsername(data, {
        showSuccessMessage: true,
        showErrorMessage: true,
      });
      dispatch(fetchUserThunk() as any);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update username."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericForm<UpdateUsername>
      fields={fields}
      schema={UpdateUsernameSchema}
      initialValues={{ username: user.username }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Username"
      externalError={error || undefined}
    />
  );
}

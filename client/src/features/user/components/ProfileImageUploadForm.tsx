import { useState } from "react";
import { User, EditUserSchema } from "../userTypes";
import { useDispatch } from "react-redux";
import { fetchUserThunk } from "../userSlice";
import MultiPartGenericForm, {
  MultiPartFieldConfig,
} from "../../common/components/MultiPartGenericForm";
import { updateUser } from "../userApi";

interface ProfileImageUploadFormProps {
  user: User;
}

export default function ProfileImageUploadForm({
  user,
}: ProfileImageUploadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const fields: MultiPartFieldConfig[] = [
    {
      name: "image",
      label: "Profile Image",
      type: "file",
      required: false,
      accept: "image/*",
    },
  ];

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await updateUser(formData, {
        showSuccessMessage: true,
        showErrorMessage: true,
      });
      dispatch(fetchUserThunk() as any);
      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
      if (error && error.response && error.response.data) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(`Failed to update user (${error.message})`);
      }
    }
  };

  return (
    <MultiPartGenericForm
      fields={fields}
      schema={EditUserSchema}
      initialValues={{
        imageUrl: user.imageUrl ?? undefined,
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Save Changes"
    />
  );
}

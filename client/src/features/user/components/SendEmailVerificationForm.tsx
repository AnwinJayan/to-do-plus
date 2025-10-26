import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import GenericForm, {
  GenericFieldConfig,
} from "../../common/components/GenericForm";
import { setUnverifiedEmail } from "../userApi";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

const fields: GenericFieldConfig[] = [
  { name: "email", label: "Enter new email", type: "text", required: true },
];

export default function SendEmailVerificationForm({
  onNext,
  setEmailObj,
}: {
  onNext: () => void;
  setEmailObj: (emailObj: any) => void;
}) {
  const { user: clerkUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const handleSubmit = async (data: { email: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await setUnverifiedEmail(data.email);
      const emailRes = await clerkUser!.createEmailAddress({
        email: data.email,
      });
      await clerkUser!.reload();
      const emailObj = clerkUser!.emailAddresses.find(
        (e) => e.id === emailRes.id
      );
      await emailObj!.prepareVerification({ strategy: "email_code" });
      setEmailObj(emailObj);
      onNext();
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericForm
      fields={fields}
      onSubmit={handleSubmit}
      initialValues={{ email: user.email }}
      isSubmitting={isSubmitting}
      submitLabel="Send Verification Code"
      externalError={error || undefined}
    />
  );
}

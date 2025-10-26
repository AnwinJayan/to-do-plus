import { useState } from "react";
import { promoteToPrimaryEmail } from "../userApi";
import { EmailAddressResource } from "@clerk/types";
import { useDispatch } from "react-redux";
import { fetchUserThunk } from "../userSlice";
import OtpInput from "../../common/components/OtpInput";
import Loader from "../../common/components/Loader";

export default function AttemptEmailVerificationForm({
  emailObj,
  onSuccess,
}: {
  emailObj: EmailAddressResource;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await emailObj.attemptVerification({ code });
      await promoteToPrimaryEmail(emailObj.emailAddress, {
        showSuccessMessage: true,
        showErrorMessage: true,
      });
      await dispatch(fetchUserThunk() as any);
      onSuccess();
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="label">Enter verification code</label>
      <OtpInput value={code} onChange={setCode} />

      {error && <p className="text-error">{error}</p>}

      {isSubmitting ? (
        <Loader />
      ) : (
        <button
          type="submit"
          className={`btn btn-primary`}
          disabled={code.length < 6}
        >
          Verify Code
        </button>
      )}
    </form>
  );
}

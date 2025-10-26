import { useState } from "react";
import SendEmailVerificationForm from "./SendEmailVerificationForm";
import AttemptEmailVerificationForm from "./AttemptEmailVerificationForm";

export default function ChangeEmail() {
  const [verificationStep, setVerificationStep] = useState<
    "prepare" | "attempt" | "success"
  >("prepare");
  const [emailObj, setEmailObj] = useState<any>(null);

  return (
    <div>
      {verificationStep === "prepare" && (
        <SendEmailVerificationForm
          setEmailObj={setEmailObj}
          onNext={() => setVerificationStep("attempt")}
        />
      )}

      {verificationStep === "attempt" && emailObj && (
        <AttemptEmailVerificationForm
          emailObj={emailObj}
          onSuccess={() => {
            setVerificationStep("success");
            setTimeout(() => setVerificationStep("prepare"), 1000);
          }}
        />
      )}

      {verificationStep === "success" && (
        <p>Your email address has been changed successfully!</p>
      )}
    </div>
  );
}

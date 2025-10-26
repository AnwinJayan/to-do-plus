import { useSelector } from "react-redux";
import LogoutButton from "../../auth/components/LogoutButton";
import type { RootState } from "../../../store";

const UserSuspendedPage = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-error/10 border border-error rounded-lg p-8 max-w-md">
        <h1 className="text-2xl font-bold text-error mb-2">
          Account Suspended
        </h1>
        <p className="mb-4">
          Your account has been suspended and you no longer have access to the
          application.
        </p>
        {user.suspensionReason && (
          <div className="mb-2 text-error font-semibold">
            Reason: {user.suspensionReason}
          </div>
        )}
        <p className="text-base-content/60 text-sm">
          If you believe this is a mistake, please contact support or an
          administrator.
        </p>
      </div>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default UserSuspendedPage;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../store";
import Loader from "../../common/components/Loader";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

import { fetchUserThunk } from "../../user/userSlice";
import { testAuthThunk } from "../authSlice";
import { UserSuspendedPage } from "../../pageIndex";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const auth = useSelector((state: RootState) => state.auth);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    (async () => {
      if (!isLoaded) return;

      // Optional delay to avoid 401 on first request
      await new Promise((res) => setTimeout(res, 300));

      const testAuthResult = await dispatch(testAuthThunk() as any);
      if (testAuthResult.meta?.requestStatus === "fulfilled") {
        await dispatch(fetchUserThunk() as any);
      }

      setHasAttemptedFetch(true);
    })();
  }, [dispatch, isLoaded, getToken]);

  const isLoading = user.loading || auth.loading || !hasAttemptedFetch;
  const isAuthenticated = auth.isAuthenticated;
  const isSuspended = user.isSuspended;

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <SignedIn>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold">
                The server is experiencing some issues at the moment!
              </h2>
              <p className="text-gray-600">
                Please try again later or contact support if the issue persists.
              </p>
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <Navigate to="/sign-in" replace />
        </SignedOut>
      </>
    );
  }

  if (isSuspended) {
    return <UserSuspendedPage />;
  }

  return <Outlet />;
}

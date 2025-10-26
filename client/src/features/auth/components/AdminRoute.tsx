import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../store";
import Loader from "../../common/components/Loader";
import { fetchUserThunk } from "../../user/userSlice";

export default function AdminRoute() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (!user._id && !user.loading) {
      dispatch(fetchUserThunk() as any).finally(() => {
        setHasAttemptedFetch(true);
      });
    } else {
      setHasAttemptedFetch(true);
    }
  }, [dispatch, user._id, user.loading]);

  const isLoading = user.loading || !hasAttemptedFetch;
  const isAdmin = user.role == "admin";

  if (isLoading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

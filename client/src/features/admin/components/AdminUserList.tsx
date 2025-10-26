import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAllUsers } from "../adminApi";
import AdminUserCard from "./AdminUserCard";
import Loader from "../../common/components/Loader";
import { User } from "../../user/userTypes";
import type { RootState } from "../../../store";

const AdminUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentUserId = useSelector((state: RootState) => state.user._id);

  useEffect(() => {
    setLoading(true);
    fetchAllUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, [refreshKey]);

  const handleStatusChange = () => setRefreshKey((k) => k + 1);

  if (loading) return <Loader />;
  if (error) return <div className="text-error">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users
        .filter((user) => user._id !== currentUserId)
        .map((user) => (
          <AdminUserCard
            key={user._id}
            user={user}
            onStatusChange={handleStatusChange}
          />
        ))}
    </div>
  );
};

export default AdminUserList;

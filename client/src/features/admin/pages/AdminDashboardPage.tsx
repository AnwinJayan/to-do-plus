import { useState } from "react";
import AdminUserList from "../components/AdminUserList";
import DangerZone from "../components/AdminDangerZone";

const AdminDashboardPage = () => {
  const [tab, setTab] = useState<"users" | "danger">("users");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          className={`btn btn-sm ${
            tab === "users" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => setTab("users")}
        >
          User List
        </button>
        <button
          className={`btn btn-sm ${
            tab === "danger" ? "btn-error" : "btn-ghost"
          }`}
          onClick={() => setTab("danger")}
        >
          Danger Zone
        </button>
      </div>
      {tab === "users" ? (
        <section>
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          <AdminUserList />
        </section>
      ) : (
        <DangerZone />
      )}
    </div>
  );
};

export default AdminDashboardPage;

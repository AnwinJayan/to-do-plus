import { useState } from "react";
import ConfirmationDialog from "../../common/components/ConfirmationDialog";
import { deleteAllUsers, deleteAllBags } from "../adminApi";

const AdminDangerZone = () => {
  const [dialog, setDialog] = useState<null | "users" | "bags">(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteAllUsers = async () => {
    setLoading(true);
    try {
      await deleteAllUsers();
      setDialog(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllBags = async () => {
    setLoading(true);
    try {
      await deleteAllBags();
      setDialog(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 border border-error bg-error/10 rounded-lg">
      <h2 className="text-xl font-bold text-error mb-4">Danger Zone</h2>
      <div className="flex flex-col gap-4">
        <button
          className="btn btn-error btn-outline"
          onClick={() => setDialog("users")}
        >
          Delete All Users
        </button>
        <button
          className="btn btn-error btn-outline"
          onClick={() => setDialog("bags")}
        >
          Delete All Bags
        </button>
      </div>
      <ConfirmationDialog
        isOpen={dialog === "users"}
        title="Delete All Users"
        message="Are you sure you want to delete ALL users? This action cannot be undone."
        onConfirm={handleDeleteAllUsers}
        onClose={() => setDialog(null)}
        isLoading={loading}
      />
      <ConfirmationDialog
        isOpen={dialog === "bags"}
        title="Delete All Bags"
        message="Are you sure you want to delete ALL bags? This action cannot be undone."
        onConfirm={handleDeleteAllBags}
        onClose={() => setDialog(null)}
        isLoading={loading}
      />
    </div>
  );
};

export default AdminDangerZone;

import { useState } from "react";
import ThemeSelect from "../components/ThemeSelect";
import ConfirmationDialog from "../../common/components/ConfirmationDialog";
import { deleteAllLists } from "../../lists/listApi"; // Changed from bags to lists

export default function SettingsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      await deleteAllLists({
        showErrorMessage: true,
        showSuccessMessage: true,
      }); // Use deleteAllLists from listApi
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title mb-4">Settings</h2>
        <div className="form-control mb-6">
          <label className="label mr-3">
            <span className="label-text">Select Theme</span>
          </label>
          <ThemeSelect />
        </div>
        <button
          className="btn btn-error"
          onClick={() => setConfirmOpen(true)}
          disabled={loading}
        >
          Delete All Lists
        </button>
        <ConfirmationDialog
          isOpen={confirmOpen}
          title="Delete All Lists"
          message="Are you sure you want to delete all lists? This action cannot be undone."
          onConfirm={handleDeleteAll}
          onClose={() => setConfirmOpen(false)}
          isLoading={loading}
        />
      </div>
    </div>
  );
}

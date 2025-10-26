import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Link } from "react-router-dom";
import AccountDeletionConfirmationDialogue from "../components/AccountDeletionConfirmationDialogue";

export default function ProfileDisplayPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user);
  return (
    <div className="card bg-base-100 shadow p-6">
      <div className="flex items-center gap-4">
        {currentUser.imageUrl ? (
          <img
            src={currentUser.imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl text-primary-content">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="font-bold text-xl">{currentUser.username}</div>
          {currentUser.email && (
            <div className="text-sm text-base-content/80">
              {currentUser.email}
            </div>
          )}
          <div className="text-sm text-gray-500">{currentUser.role}</div>
          {currentUser.isSuspended && (
            <div className="text-error mt-1">
              Suspended: {currentUser.suspensionReason || "No reason provided"}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Link to="/account/edit" className="btn btn-primary">
          Edit Account Details
        </Link>
        <button
          className="btn btn-error ml-auto"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>
      <AccountDeletionConfirmationDialogue
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

import { useState } from "react";
import { User } from "../../user/userTypes";
import Modal from "../../common/components/Modal";
import GenericForm from "../../common/components/GenericForm";
import ConfirmationDialog from "../../common/components/ConfirmationDialog";
import { SuspentionRequestSchema } from "../adminTypes";
import {
  suspendUser,
  unsuspendUser,
  deleteUser,
  makeuserAdminById,
  revokeAdminById,
} from "../adminApi";
import { FaTrash } from "react-icons/fa";

interface AdminUserCardProps {
  user: User;
  onStatusChange?: () => void;
}

const AdminUserCard = ({ user, onStatusChange }: AdminUserCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleSuspend = async (data: { reason: string }) => {
    setLoading(true);
    try {
      await suspendUser({ userId: user._id, reason: data.reason });
      setModalOpen(false);
      onStatusChange?.();
    } finally {
      setLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    setLoading(true);
    try {
      await unsuspendUser({ userId: user._id });
      onStatusChange?.();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(user._id);
      setDeleteDialogOpen(false);
      onStatusChange?.();
    } finally {
      setDeleting(false);
    }
  };

  const handleMakeAdmin = async () => {
    setAdminLoading(true);
    try {
      await makeuserAdminById(user._id);
      onStatusChange?.();
    } finally {
      setAdminLoading(false);
    }
  };

  const handleRevokeAdmin = async () => {
    setAdminLoading(true);
    try {
      await revokeAdminById(user._id);
      onStatusChange?.();
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div
      className={`card bg-base-100 shadow p-4 flex flex-col gap-2 border transition-all duration-200 ${
        user.isSuspended ? "border-error bg-error/10" : "border-base-200"
      }`}
    >
      <div className="flex items-center gap-3">
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt={user.username + " avatar"}
            className="w-10 h-10 rounded-full object-cover border"
          />
        )}
        <div className="flex-1">
          <div className="font-semibold">@{user.username}</div>
          <div className="text-xs text-base-content/60">{user.role}</div>
          {user.email && (
            <div className="text-xs text-base-content/80">{user.email}</div>
          )}
        </div>
        <button
          className="btn btn-ghost btn-square btn-sm text-error"
          title="Delete user"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={deleting}
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
      {user.isSuspended && <div className="badge badge-error">Suspended</div>}
      {user.suspensionReason && (
        <div className="text-xs text-error">
          Reason: {user.suspensionReason}
        </div>
      )}
      <div className="text-xs text-base-content/50">
        Joined: {new Date(user.createdAt).toLocaleDateString()}
      </div>
      <div className="mt-2 flex gap-2 flex-wrap">
        {!user.isSuspended ? (
          <button
            className="btn btn-warning btn-sm"
            onClick={() => setModalOpen(true)}
            disabled={loading}
          >
            Suspend
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm"
            onClick={handleUnsuspend}
            disabled={loading}
          >
            Unsuspend
          </button>
        )}
        {user.role !== "admin" ? (
          <button
            className="btn btn-info btn-sm"
            onClick={handleMakeAdmin}
            disabled={adminLoading}
          >
            {adminLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Make Admin"
            )}
          </button>
        ) : (
          <button
            className="btn btn-outline btn-sm"
            onClick={handleRevokeAdmin}
            disabled={adminLoading}
          >
            {adminLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Revoke Admin"
            )}
          </button>
        )}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Suspend @${user.username}`}
      >
        <GenericForm
          fields={[
            {
              name: "reason",
              label: "Suspension Reason",
              type: "text",
              required: true,
              placeholder: "Enter reason for suspension",
            },
          ]}
          schema={SuspentionRequestSchema.pick({ reason: true })}
          onSubmit={handleSuspend}
          submitLabel={loading ? "Suspending..." : "Confirm Suspend"}
          isSubmitting={loading}
        />
      </Modal>
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete @${user.username}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
        isLoading={deleting}
      />
    </div>
  );
};

export default AdminUserCard;

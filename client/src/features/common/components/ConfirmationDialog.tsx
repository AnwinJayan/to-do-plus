import Modal from "./Modal";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean; // Add this prop
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <>
        <div className="mb-6 text-base-content">{message}</div>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-ghost" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-error"
            disabled={isLoading}
          >
            {isLoading ? <span className="loading loading-spinner"></span> : "Confirm"}
          </button>
        </div>
      </>
    </Modal>
  );
}

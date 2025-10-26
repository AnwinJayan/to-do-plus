import { useState } from "react";
import ConfirmationDialog from "../../common/components/ConfirmationDialog";
import { deleteUser } from "../userApi";
import { useDispatch } from "react-redux";
import { clearUser } from "../userSlice";
import { useClerk } from "@clerk/clerk-react";

interface AccountDeletionConfirmationDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function AccountDeletionConfirmationDialogue({
  isOpen,
  onClose,
  onDeleted,
}: AccountDeletionConfirmationDialogueProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const { signOut } = useClerk();

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      dispatch(clearUser());
      await signOut({ redirectUrl: "/sign-in" });
      setIsDeleting(false);
      if (onDeleted) onDeleted();
      onClose();
    } catch (_err) {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      title="Delete Account"
      message="Are you sure you want to delete your account? This action cannot be undone."
      onConfirm={handleConfirm}
      onClose={onClose}
      isLoading={isDeleting}
    />
  );
}

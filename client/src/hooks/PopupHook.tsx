import { useState } from "react";
import UserCard from "../features/user/components/UserCard";

export default function useUserCardPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [position, setPosition] = useState<
    { top: number; left: number } | undefined
  >(undefined);

  const openPopup = (id: string, event?: React.MouseEvent) => {
    setUserId(id);

    // If event is provided, position near the click
    if (event) {
      // Calculate position (slightly below and to the right of click)
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
    } else {
      setPosition(undefined); // Use default centering
    }

    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  // The component to render
  const popupComponent =
    isOpen && userId ? (
      <UserCard userId={userId} onClose={closePopup} position={position} />
    ) : null;

  return {
    openPopup,
    closePopup,
    popupComponent,
  };
}

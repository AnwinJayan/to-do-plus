import React, { useEffect, useRef, useState } from "react";
import { User } from "../userTypes";
import { fetchUserById } from "../userApi";

interface UserCardProps {
  userId: string;
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function UserCard({ userId, onClose, position }: UserCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserById(userId, {
          showErrorMessage: true,
        });
        setUser(userData);
        setError(null);
      } catch (err) {
        setError("Failed to load user");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Handle clicks, or scrolls or any mouse events outside the card to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Position the card
  const cardStyle: React.CSSProperties = position
    ? {
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 50,
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
      };

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
      style={{ background: "transparent" }}
    >
      <div
        ref={cardRef}
        style={cardStyle}
        className="card bg-base-100 shadow-lg p-2 w-48 border border-base-300 rounded-lg"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {loading ? (
          <div className="flex justify-center p-2">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : error ? (
          <div className="p-2">
            <p className="text-error text-xs">{error}</p>
          </div>
        ) : (
          user && (
            <div className="flex flex-col gap-2 p-1 rounded-lg">
              <div className="flex items-center gap-2">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm text-primary-content">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.username}
                  </p>
                  {user.role === "admin" && (
                    <span className="badge badge-primary badge-sm">Admin</span>
                  )}
                </div>
              </div>
              {/* Display username explicitly */}
              <div className="text-xs text-gray-500 break-all">
                Email: {user.email}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

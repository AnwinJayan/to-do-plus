import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  widthClass?: string; // e.g., "w-96", "max-w-lg"
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  widthClass = "w-96",
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed mx-3 inset-0 flex items-center justify-center bg-opacity-70 backdrop-blur-sm z-50">
      <div
        className={`relative bg-base-100 rounded-lg shadow-lg p-6 ${widthClass} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 text-base-content hover:text-error text-xl font-bold focus:outline-none"
          type="button"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-lg font-bold mb-4 text-base-content">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}

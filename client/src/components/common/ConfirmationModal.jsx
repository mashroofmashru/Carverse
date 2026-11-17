import React from "react";
import { AlertCircle } from "lucide-react";
import useModal from "../../hooks/useModal";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
}) => {
  useModal(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <span
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${
              type === "danger" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
            }`}
          >
            <AlertCircle size={28} aria-hidden="true" />
          </span>

          <h3 id="confirm-title" className="text-xl font-bold text-ink">
            {title}
          </h3>

          <p id="confirm-message" className="text-sm text-gray-600 mt-2 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full mt-8">
            <button type="button" autoFocus onClick={onClose} className="btn btn-light flex-1">
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`btn flex-1 ${type === "danger" ? "btn-danger" : "btn-brand"}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

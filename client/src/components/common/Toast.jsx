import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const Toast = ({ show, message, type = "success", onClose }) => {
  // Auto-hide after 3 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [show, message, onClose]);

  if (!show) return null;

  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-8 sm:right-8 sm:max-w-md z-[120] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border bg-white animate-in slide-in-from-right duration-300 ${
        isSuccess ? "border-green-100 text-green-800" : "border-red-100 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="text-green-600 shrink-0" size={20} />
      ) : (
        <AlertCircle className="text-red-600 shrink-0" size={20} />
      )}

      <span className="font-semibold text-sm flex-1 break-words">{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="icon-btn !h-7 !w-7 !rounded-full"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;

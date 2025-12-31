import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const Toast = ({ show, message, type = "success", onClose }) => {
  // Auto-hide logic
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-8 right-8 z-[120] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
        type === "success"
          ? "bg-white border-green-100 text-green-800"
          : "bg-white border-red-100 text-red-800"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="text-green-500" size={20} />
      ) : (
        <AlertCircle className="text-red-500" size={20} />
      )}
      
      <span className="font-bold text-sm whitespace-nowrap">{message}</span>

      {/* Manual close button */}
      <button 
        onClick={onClose}
        className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
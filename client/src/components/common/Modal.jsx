import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import useModal from "../../hooks/useModal";

// Dialog shell: backdrop, header with close button, scrolling body.
// Escape / backdrop click close it unless `locked` (for example while a request is running).
// Focus moves into the dialog when it opens and returns to the opener when it closes.
const Modal = ({ title, subtitle, onClose, children, size = "max-w-2xl", locked = false, titleId = "modal-title" }) => {
  const dialogRef = useRef(null);
  useModal(true, locked ? undefined : onClose);

  useEffect(() => {
    const opener = document.activeElement;
    dialogRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={locked ? undefined : onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-[90vh] w-full ${size} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 px-6 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-xl font-bold">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 truncate text-xs text-gray-600">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={locked} className="icon-btn -mr-2" aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

import React from "react";

// Centred "nothing here" block: icon, title, optional hint and optional action button(s).
const EmptyState = ({ icon, title, hint, children }) => {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-mist-deep">
          <Icon size={26} aria-hidden="true" />
        </span>
      )}
      <p className="text-lg font-semibold">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-gray-600">{hint}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
};

export default EmptyState;

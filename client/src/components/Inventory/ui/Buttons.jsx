import React from "react";

export const PrimaryButton = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-lg ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full py-3 text-gray-700 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200 transition ${className}`}
  >
    {children}
  </button>
);

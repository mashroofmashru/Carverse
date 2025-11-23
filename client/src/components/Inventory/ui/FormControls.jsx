import React from "react";

export const TextInput = ({ id, label, className = "", ...props }) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="text-sm font-semibold text-gray-700 block mb-2"
      >
        {label}
      </label>
    )}
    <input
      id={id}
      {...props}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition ${className}`}
    />
  </div>
);

export const NumberInput = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition ${className}`}
  />
);

export const Select = ({ id, label, className = "", children, ...props }) => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className="text-sm font-semibold text-gray-700 block mb-2"
      >
        {label}
      </label>
    )}
    <select
      id={id}
      {...props}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition ${className}`}
    >
      {children}
    </select>
  </div>
);

export const Checkbox = ({ label, className = "", ...props }) => (
  <label className="flex items-center text-sm">
    <input
      type="checkbox"
      {...props}
      className={`rounded text-primary focus:ring-primary mr-2 ${className}`}
    />
    {label}
  </label>
);

export const Radio = ({ label, name, className = "", ...props }) => (
  <label className="flex items-center text-sm">
    <input
      type="radio"
      name={name}
      {...props}
      className={`text-primary focus:ring-primary mr-2 ${className}`}
    />
    {label}
  </label>
);

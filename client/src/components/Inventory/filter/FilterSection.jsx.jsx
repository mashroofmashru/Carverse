import React from "react";

const FilterSection = ({ title, children, className = "" }) => (
  <div className={`pb-4 border-b border-gray-200 ${className}`}>
    {title && (
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
    )}
    {children}
  </div>
);

export default FilterSection;

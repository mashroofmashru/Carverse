import React from "react";

// Card that holds a table and scrolls sideways if it ever gets too wide.
const TableCard = ({ children, className = "" }) => (
  <div className={`card overflow-hidden ${className}`}>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  </div>
);

// Column header cell with the shared look and scope="col" for screen readers.
export const Th = ({ children, className = "" }) => (
  <th scope="col" className={`px-5 py-3.5 text-xs font-semibold text-gray-600 ${className}`}>
    {children}
  </th>
);

export const THEAD_CLASS = "border-b border-neutral-200 bg-mist";
export const TBODY_CLASS = "divide-y divide-neutral-100";

export default TableCard;

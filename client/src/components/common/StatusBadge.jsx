import React from "react";

// One place that maps a car / order status from the API to a badge colour and label.
// "Sold" is neutral on purpose: for a dealer it is good news, so it should not look like an error.
const STATUS = {
  AVAILABLE: ["badge-success", "Available"],
  SOLD: ["badge-neutral", "Sold"],
  COMPLETED: ["badge-success", "Completed"],
  PENDING: ["badge-warning", "Pending"],
  CANCELLED: ["badge-danger", "Cancelled"],
};

const StatusBadge = ({ status }) => {
  const [tone, text] = STATUS[status] || ["badge-neutral", status || "Unknown"];
  return <span className={`badge ${tone}`}>{text}</span>;
};

export default StatusBadge;

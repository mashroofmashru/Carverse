// Shared display helpers so prices, dates and labels look the same on every page.

// 110000 -> "₹1,10,000"
export const formatINR = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "₹0";
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

// "2026-11-15T..." -> "15 November 2026"
export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

// Database enums -> readable text
const LABELS = {
  SUVs: "SUV",
  SEDAN: "Sedan",
  HATCHBACK: "Hatchback",
  ELECTRIC: "Electric",
  PETROL: "Petrol",
  DIESEL: "Diesel",
  HYBRID: "Hybrid",
  MANUAL: "Manual",
  AUTOMATIC: "Automatic",
  AVAILABLE: "Available",
  SOLD: "Sold",
};

export const label = (value) => (value == null ? "" : LABELS[value] ?? value);

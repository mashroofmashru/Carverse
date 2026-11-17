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

// "2026-11-15T..." -> "just now" / "5 minutes ago" / "3 days ago" / "2 months ago"
export const timeAgo = (date) => {
  const seconds = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  if (!Number.isFinite(seconds) || seconds < 45) return "just now";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, size] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${name}${n === 1 ? "" : "s"} ago`;
  }
  return "just now";
};

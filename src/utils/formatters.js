// src/utils/formatters.js
// Format date for display
export const formatDate = (date) => {
  if (!date) return "";

  // If date is a timestamp or string, convert to Date object
  const dateObj = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateObj);
};

// Format date for input fields
export const formatDateForInput = (date) => {
  if (!date) return "";

  // If date is a timestamp or string, convert to Date object
  const dateObj = date instanceof Date ? date : new Date(date);

  // Format as YYYY-MM-DD for date inputs
  return dateObj.toISOString().split("T")[0];
};

// Format currency
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "£0.00";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount);
};

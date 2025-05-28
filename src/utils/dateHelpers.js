// src/utils/dateHelpers.js

/**
 * Converts a date string in DD/MM/YYYY format to a Date object
 * @param {string} dateString - Date string in DD/MM/YYYY format
 * @returns {Date} JavaScript Date object
 */
export const parseStringDate = (dateString) => {
  if (!dateString) return null;

  // Split the date string by '/'
  const parts = dateString.split("/");

  // Check if the date string is in the expected format
  if (parts.length !== 3) {
    console.error("Invalid date format. Expected DD/MM/YYYY, got:", dateString);
    return null;
  }

  // Create a new Date object (month is 0-indexed in JavaScript Date)
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
};

/**
 * Formats a Date object to a string in DD/MM/YYYY format
 * @param {Date} date - JavaScript Date object
 * @returns {string} Date string in DD/MM/YYYY format
 */
export const formatDateToString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return "";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formats a Date object to a string in YYYY-MM-DD format (for input[type="date"])
 * @param {Date} date - JavaScript Date object
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return "";
  }

  return date.toISOString().substr(0, 10);
};

/**
 * Converts a date string in DD/MM/YYYY format to YYYY-MM-DD format for input[type="date"]
 * @param {string} dateString - Date string in DD/MM/YYYY format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const convertToInputDateFormat = (dateString) => {
  const date = parseStringDate(dateString);
  return date ? formatDateForInput(date) : "";
};

/**
 * Gets today's date in DD/MM/YYYY format
 * @returns {string} Today's date in DD/MM/YYYY format
 */
export const getTodayString = () => {
  return formatDateToString(new Date());
};

/**
 * Validates if a string is in the format DD/MM/YYYY
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if the date string is valid
 */
export const isValidDateString = (dateString) => {
  if (!dateString) return false;

  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;

  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
};

const {
  EXAM_TYPES,
  MEDIUM_TYPES,
  PAPER_TYPES,
  FEES,
} = require("../config/constant");

const validatePaper = (data) => {
  const errors = [];

  // Validate exam
  if (!data.exam || !Object.values(EXAM_TYPES).includes(data.exam)) {
    errors.push("Invalid or missing 'exam'.");
  }

  // Validate medium
  if (!data.medium || !Object.values(MEDIUM_TYPES).includes(data.medium)) {
    errors.push("Invalid or missing 'medium'.");
  }

  // Validate type
  if (!data.type || !Object.values(PAPER_TYPES).includes(data.type)) {
    errors.push("Invalid or missing 'type'.");
  }

  // Validate fee
  if (!data.fee || !Object.values(FEES).includes(data.fee)) {
    errors.push("Invalid or missing 'fee'.");
  }

  // Validate year
  if (!data.year) {
    errors.push("Invalid or missing 'year'.");
  }

  // Validate longName
  if (!data.longName || typeof data.longName !== "string") {
    errors.push("Invalid or missing 'longName'.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validatePaper };

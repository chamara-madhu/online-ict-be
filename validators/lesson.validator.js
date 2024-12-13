const { EXAM_TYPES } = require("../config/constant");

const validateLesson = (data) => {
  const errors = [];

  // Validate exam
  if (!data.exam || !Object.values(EXAM_TYPES).includes(data.exam)) {
    errors.push("Invalid or missing 'exam'.");
  }

  // Validate no
  if (!data.no) {
    errors.push("Invalid or missing 'no'. It must be a number.");
  }

  // Validate lesson
  if (!data.lesson || typeof data.lesson !== "string") {
    errors.push("Invalid or missing 'lesson'. It must be a string.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validateLesson };

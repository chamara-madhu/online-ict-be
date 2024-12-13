const {
  QUESTION_TYPES,
  QUESTION_DIFFICULTY_TYPES,
} = require("../config/constant");

const validateQuestion = (data) => {
  const errors = [];

  // Validate 'no'
  if (!data.no) {
    errors.push("Invalid or missing 'no'. It must be a number.");
  }

  // Validate 'type'
  if (!data.type || !Object.values(QUESTION_TYPES).includes(data.type)) {
    errors.push("Invalid or missing 'type'.");
  }

  // Validate 'question'
  if (!data.question || typeof data.question !== "string") {
    errors.push("Invalid or missing 'question'. It must be a string.");
  }

  // Validate 'options'
  if (!Array.isArray(data.options) || data.options.length === 0) {
    errors.push(
      "Invalid or missing 'options'. It must be a non-empty array of strings."
    );
  } else if (!data.options.every((option) => typeof option === "string")) {
    errors.push("'options' must contain only strings.");
  }

  // Validate 'answer'
  if (!Array.isArray(data.answer) || data.answer.length === 0) {
    errors.push(
      "Invalid or missing 'answer'. It must be a non-empty array of numbers."
    );
  }

  // Validate 'difficulty'
  if (
    !data.difficulty ||
    !Object.values(QUESTION_DIFFICULTY_TYPES).includes(data.difficulty)
  ) {
    errors.push("Invalid or missing 'difficulty'.");
  }

  // Validate 'paper'
  if (!data.paperId) {
    errors.push("Invalid or missing 'paper'. It must be a valid ID.");
  }

  // Validate 'lesson'
  if (!data.lessonId) {
    errors.push("Invalid or missing 'lesson'. It must be a valid ID.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validateQuestion };

const mongoose = require("mongoose");
const { EXAM_TYPES } = require("../config/constant");

const lessonSchema = mongoose.Schema(
  {
    exam: {
      type: String,
      enum: Object.values(EXAM_TYPES),
      required: true,
    },
    no: {
      type: Number,
      required: true,
    },
    lesson: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lesson", lessonSchema);

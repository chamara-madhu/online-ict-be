const mongoose = require("mongoose");
const {
  QUESTION_TYPES,
  QUESTION_DIFFICULTY_TYPES,
  IS_APPROVED_TYPES,
} = require("../config/constant");

const questionSchema = mongoose.Schema(
  {
    no: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(QUESTION_TYPES),
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    restOfQuestion: {
      type: String,
      default: null,
    },
    options: {
      type: [String],
      required: true,
    },
    answer: {
      type: [Number],
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(QUESTION_DIFFICULTY_TYPES),
      default: QUESTION_DIFFICULTY_TYPES.MEDIUM,
      required: true,
    },
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: false,
    },
    isApproved: {
      type: String,
      enum: Object.values(IS_APPROVED_TYPES),
      default: IS_APPROVED_TYPES.NO,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);

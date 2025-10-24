const mongoose = require("mongoose");

const markSchema = mongoose.Schema(
  {
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    medal: {
      type: Number,
      default: null,
    },
    answers: {
      type: [[Number]],
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
    },
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mark", markSchema);

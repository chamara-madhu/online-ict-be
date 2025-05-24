const mongoose = require("mongoose");
const {
  EXAM_TYPES,
  MEDIUM_TYPES,
  PAPER_TYPES,
  FEES,
  IS_APPROVED_TYPES,
} = require("../config/constant");

const paperSchema = mongoose.Schema(
  {
    exam: {
      type: String,
      enum: Object.values(EXAM_TYPES),
      required: true,
    },
    medium: {
      type: String,
      enum: Object.values(MEDIUM_TYPES),
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(PAPER_TYPES),
      required: true,
    },
    fee: {
      type: String,
      enum: Object.values(FEES),
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    longName: {
      type: String,
      required: true,
    },
    stats: {
      noOfStuds: { type: Number },
      a: { type: Number },
      b: { type: Number },
      c: { type: Number },
      s: { type: Number },
      f: { type: Number },
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

module.exports = mongoose.model("Paper", paperSchema);

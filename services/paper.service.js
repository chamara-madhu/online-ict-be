const Paper = require("../models/paper.model");
const Question = require("../models/question.model");
const Mark = require("../models/mark.model");
const Payment = require("../models/payment.model");
const {
  MEDALS,
  FEES,
  PAID_ATTEMPTS,
  FREE_ATTEMPTS,
} = require("../config/constant");

class PaperService {
  async create(data) {
    const paper = new Paper(data);
    return await paper.save();
  }

  async findAll(query) {
    const { exam, medium, type, isApproved } = query;

    const filter = {};
    if (exam) filter.exam = exam;
    if (medium) filter.medium = medium;
    if (type) filter.type = type;
    if (isApproved) filter.isApproved = "Yes";

    const papers = await Paper.find(filter)
      .sort({ year: -1 })
      .select("-__v -createdAt -updatedAt")
      .exec();

    return papers;
  }

  async findOne(id) {
    return await Paper.findById(id).exec();
  }

  async update(id, data) {
    const updatedPaper = await Paper.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    return updatedPaper;
  }

  async remove(id) {
    await Paper.findByIdAndDelete(id).exec();
  }

  async paperApproval(id, isApproved) {
    await Paper.findByIdAndUpdate(
      id,
      {
        isApproved,
      },
      {
        new: true,
      }
    ).exec();
  }

  async markPaper(paperId, userId, answers, timeSpent) {
    // Fetch the questions for the paper
    const questions = await Question.find({
      paper: paperId,
    })
      .sort({ no: 1 })
      .select("no answer")
      .exec();

    // Ensure answers array length matches the questions
    if (answers.length !== questions.length) {
      throw new Error("Mismatch between provided answers and questions");
    }

    // Calculate the marks
    let correctAnswers = 0;

    questions.forEach((question, index) => {
      // Compare user's answer with the correct answer
      if (JSON.stringify(answers[index]) === JSON.stringify(question.answer)) {
        correctAnswers++;
      }
    });

    // Calculate percentage
    const percentage = (correctAnswers / questions.length) * 100;

    let medal = null;

    if (percentage >= 90) {
      medal = MEDALS.GOLD;
    } else if (percentage >= 80) {
      medal = MEDALS.SILVER;
    } else if (percentage >= 70) {
      medal = MEDALS.BRONZE;
    }

    const mark = new Mark({
      totalQuestions: questions.length,
      correctAnswers,
      user: userId,
      paper: paperId,
      marks: percentage,
      medal,
      answers,
      timeSpent,
    });

    const res = await mark.save();

    return {
      id: res._id,
    };
  }

  async checkEligibility(paperId, userId) {
    const paper = await Paper.findById(paperId).exec();

    if (paper?.fee === FEES.FREE) {
      const marks = await Mark.find({ user: userId, paper: paperId }).exec();

      const remainingAttempts = FREE_ATTEMPTS - (marks?.length || 0);

      if (remainingAttempts) {
        return {
          attemptsRemaining: remainingAttempts,
        };
      } else {
        return {
          attemptsRemaining: 0,
        };
      }
    } else {
      const payment = await Payment.find({
        user: userId,
        paper: paperId,
      });

      if (payment?.length) {
        const marks = await Mark.find({ user: userId, paper: paperId }).exec();

        const remainingAttempts = PAID_ATTEMPTS - (marks?.length || 0);

        if (remainingAttempts) {
          return {
            attemptsRemaining: remainingAttempts,
          };
        } else {
          return {
            attemptsRemaining: 0,
          };
        }
      } else {
        return {
          isNeedToBuy: true,
        };
      }
    }
  }
}

module.exports = new PaperService();

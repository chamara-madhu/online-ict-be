const Paper = require("../models/paper.model");
const Question = require("../models/question.model");
const Mark = require("../models/mark.model");
const { MEDALS } = require("../config/constant");

class PaperService {
  async create(data) {
    const paper = new Paper(data);
    return await paper.save();
  }

  async findAll(query) {
    const { exam, medium, type } = query;

    const filter = {};
    if (exam) filter.exam = exam;
    if (medium) filter.medium = medium;
    if (type) filter.type = type;

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

  async markPaper(paperId, userId, answers) {
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
    });

    const res = await mark.save();

    return {
      id: res._id,
    };
  }
}

module.exports = new PaperService();

const Question = require("../models/question.model");
const Paper = require("../models/paper.model");
const Lesson = require("../models/lesson.model");
const { mongoose } = require("mongoose");

class QuestionService {
  async create(data) {
    const question = new Question(data);

    // Fetch the Paper and Lesson documents
    const paper = await Paper.findById(data.paperId).exec();
    const lesson = await Lesson.findById(data.lessonId).exec();

    if (paper) question.paper = paper;
    if (lesson) question.lesson = lesson;

    return await question.save();
  }

  async findAll(query) {
    const { exam, medium, type } = query;

    const filter = {};
    if (exam) filter.exam = exam;
    if (medium) filter.medium = medium;
    if (type) filter.type = type;

    // Use Mongoose to find, sort, and select specific fields
    const questions = await Question.find(filter)
      .sort({ no: "asc" }) // Correct syntax for sorting in descending order
      .populate("paper") // Correct syntax for sorting in descending order
      .select("-createdAt -updatedAt -__v") // Correct syntax for selecting specific fields
      .lean();

    return questions;
  }

  async getAllQuestionsByPaperId(paperId) {
    console.log({ paperId });
    const paper = await Paper.findOne({
      _id: paperId,
    })
      .select("-__v -createdAt -updatedAt")
      .exec();

    const questions = await Question.find({
      paper: paperId,
    })
      .sort({ no: 1 })
      .select("-__v -createdAt -updatedAt -answer")
      .exec();

    console.log({ paper, questions });

    return { paper, questions };
  }

  async findOne(id) {
    return await Question.findById(id).exec();
  }

  async update(id, data) {
    const updatedQuestion = await Question.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    return updatedQuestion;
  }

  async remove(id) {
    await Question.findByIdAndDelete(id).exec();
  }
}

module.exports = new QuestionService();

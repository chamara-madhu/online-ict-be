const Question = require("../models/question.model");
const Paper = require("../models/paper.model");
const Lesson = require("../models/lesson.model");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { mongoose } = require("mongoose");
const { extractQuestionsFromText } = require("../utils/gptService");
const {
  QUESTION_TYPES,
  QUESTION_DIFFICULTY_TYPES,
} = require("../config/constant");

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

  async scan(paperId, file) {
    let text = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    console.log("text", text);

    // const result = await extractQuestionsFromText(file.buffer.toString('base64'));
    const result = await extractQuestionsFromText(text);
    console.log("result", result.questions);
    console.log("result", result.questions.length);
    // Fetch the Paper and Lesson documents
    const paper = await Paper.findById(paperId).exec();

    let count = 1;
    for (const question of result?.questions) {
      const lesson = await Lesson.findOne({ lesson: question?.lesson }).exec();

      console.log("lesson", lesson)

      const obj = {
        no: count,
        type: QUESTION_TYPES.MCQ,
        question: question?.question || "",
        options: question?.answerOptions || [],
        answer: question?.answer || [],
        difficulty: question?.difficulty || QUESTION_DIFFICULTY_TYPES.MEDIUM,
        paper,
        lesson
      };
      console.log("obj", obj);
      const newQuestion = new Question(obj);
      await newQuestion.save();

      count++;
    }

    return {
      noOfQuestions: count
    }

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

    return { paper, questions };
  }

  async getAllQuestionsAndAnswersByPaperId(paperId) {
    const paper = await Paper.findOne({
      _id: paperId,
    })
      .select("-__v -createdAt -updatedAt")
      .exec();

    const questions = await Question.find({
      paper: paperId,
    })
      .sort({ no: 1 })
      .select("-__v -createdAt -updatedAt")
      .exec();

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

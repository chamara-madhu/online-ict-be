const Question = require("../models/question.model");
const Paper = require("../models/paper.model");
const Lesson = require("../models/lesson.model");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { mongoose } = require("mongoose");
const {
  extractQuestionsFromText,
  generateModelPaper,
} = require("../utils/gptService");
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

  async findAll(query) {
    const { exam, medium, type } = query;

    const filter = {};
    if (exam) filter.exam = exam;
    if (medium) filter.medium = medium;
    if (type) filter.type = type;

    // Use Mongoose to find, sort, and select specific fields
    const questions = await Question.find(filter)
      .sort({ no: "asc" })
      .populate("paper")
      .select("-createdAt -updatedAt -__v")
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
      .populate("lesson")
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

  async questionApproval(id, isApproved) {
    await Question.findByIdAndUpdate(
      id,
      {
        isApproved,
      },
      {
        new: true,
      }
    ).exec();
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

    // const result = await extractQuestionsFromText(file.buffer.toString('base64'));
    const result = await extractQuestionsFromText(text);

    // Fetch the Paper and Lesson documents
    const paper = await Paper.findById(paperId).exec();

    let count = 1;
    for (const question of result?.questions) {
      const lesson = await Lesson.findOne({ lesson: question?.lesson }).exec();

      const obj = {
        no: count,
        type: QUESTION_TYPES.MCQ,
        question: question?.question || "",
        options: question?.answerOptions || [],
        answer: question?.answer || [],
        difficulty: question?.difficulty || QUESTION_DIFFICULTY_TYPES.MEDIUM,
        answerClarification: question?.answerClarification || "",
        paper,
        lesson,
      };
      const newQuestion = new Question(obj);
      await newQuestion.save();

      count++;
    }

    return {
      noOfQuestions: count,
    };
  }

  async generateModelPaper(paperId) {
    const result = await generateModelPaper();

    // Fetch the Paper and Lesson documents
    const paper = await Paper.findById(paperId).exec();

    let count = 1;

    for (const question of result?.questions) {
      const lesson = await Lesson.findOne({ lesson: question?.lesson }).exec();

      const obj = {
        no: count,
        type: QUESTION_TYPES.MCQ,
        question: question?.question || "",
        options: question?.answerOptions || [],
        answer: question?.answer || [],
        difficulty: question?.difficulty || QUESTION_DIFFICULTY_TYPES.MEDIUM,
        answerClarification: question?.answerClarification || "",
        paper,
        lesson,
      };

      const newQuestion = new Question(obj);
      await newQuestion.save();

      count++;
    }

    return {
      noOfQuestions: count,
    };
  }

  async getLessonStatsByPaperId(paperId) {
    const results = await Question.aggregate([
      // 1️⃣ Filter questions for the given paper
      {
        $match: { paper: new mongoose.Types.ObjectId(paperId) },
      },

      // 2️⃣ Group by lesson and count
      {
        $group: {
          _id: "$lesson",
          questionCount: { $sum: 1 },
        },
      },

      // 3️⃣ Lookup lesson details
      {
        $lookup: {
          from: "lessons", // collection name (lowercase plural of model)
          localField: "_id", // lesson ObjectId
          foreignField: "_id",
          as: "lesson",
        },
      },

      // 4️⃣ Unwind the lesson array (each group has exactly one lesson)
      {
        $unwind: {
          path: "$lesson",
          preserveNullAndEmptyArrays: true, // handle questions without lesson
        },
      },

      // 5️⃣ Optional: sort by lesson.no or any field you want
      {
        $sort: { "lesson.no": 1 },
      },

      // 6️⃣ Optional: project the final shape
      {
        $project: {
          _id: 0,
          lessonId: "$lesson._id",
          lessonName: "$lesson.lesson",
          lessonNo: "$lesson.no",
          questionCount: 1,
        },
      },
    ]);

    return results;
  }
}

module.exports = new QuestionService();

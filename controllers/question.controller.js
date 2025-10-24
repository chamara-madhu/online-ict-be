const {
  create,
  findAll,
  getAllQuestionsByPaperId,
  findOne,
  update,
  remove,
  getAllQuestionsAndAnswersByPaperId,
  scan,
  generateModelPaper,
  getLessonStatsByPaperId,
  questionApproval,
} = require("../services/question.service");
const { validateQuestion } = require("../validators/question.validator");

// Create a question
exports.create = async (req, res) => {
  try {
    const { isValid, errors } = validateQuestion(req.body);

    // If validation fails, return a 400 error
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const question = await create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find all questions with optional query parameters
exports.findAll = async (req, res) => {
  try {
    const { exam, medium, type } = req.query;
    const questions = await findAll({ exam, medium, type });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all questions by paper ID
exports.getAllQuestionsByPaperId = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const questions = await getAllQuestionsByPaperId(paperId);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all questions and answers by paper ID
exports.getAllQuestionsAndAnswersByPaperId = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const questions = await getAllQuestionsAndAnswersByPaperId(paperId);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find a question by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const question = await findOne(id);
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a question by ID
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedQuestion = await update(id, req.body);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a question by ID
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    await remove(id);
    res.status(204).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Status approval
exports.questionApproval = async (req, res) => {
  try {
    const id = req.params.id;
    const isApproved = req.body.isApproved;
    await questionApproval(id, isApproved);
    res.status(200).json({ message: "Status changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// scan question
exports.scan = async (req, res) => {
  try {
    const file = req.file; // the file is in memory as a Buffer
    const buffer = file.buffer; // <-- this is your file content
    const { paperId } = req.body;

    // Example: log the file type and size
    console.log("MIME type:", file.mimetype);
    console.log("Size:", file.size);
    console.log("Buffer:", buffer);

    // const { isValid, errors } = validateQuestion(req.body);

    // If validation fails, return a 400 error
    // if (!isValid) {
    //   return res.status(400).json({ message: "Validation failed", errors });
    // }

    const result = await scan(paperId, file);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// generateModelPaper question
exports.generateModelPaper = async (req, res) => {
  try {
    const { paperId } = req.body;
    const result = await generateModelPaper(paperId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getLessonStatsByPaperId question
exports.getLessonStatsByPaperId = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const result = await getLessonStatsByPaperId(paperId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

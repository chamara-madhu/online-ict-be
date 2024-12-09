const {
  create,
  findAll,
  getAllQuestionsByPaperId,
  findOne,
  update,
  remove,
  markPaper,
} = require("../services/question.service");

// Create a question
exports.create = async (req, res) => {
  try {
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
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const {
  create,
  findAll,
  findOne,
  update,
  remove,
  markPaper,
  checkEligibility,
  paperApproval,
} = require("../services/paper.service");
const { validatePaper } = require("../validators/paper.validator");

// Create a paper
exports.create = async (req, res) => {
  try {
    const { isValid, errors } = validatePaper(req.body);

    // If validation fails, return a 400 error
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const paper = await create(req.body);
    res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find all papers with optional query parameters
exports.findAll = async (req, res) => {
  try {
    const { exam, medium, type, isApproved } = req.query;
    const papers = await findAll({ exam, medium, type, isApproved });
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find a paper by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const paper = await findOne(id);
    if (paper) {
      res.status(200).json(paper);
    } else {
      res.status(404).json({ message: "Paper not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a paper by ID
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPaper = await update(id, req.body);
    res.status(200).json(updatedPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a paper by ID
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    await remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Status approval
exports.paperApproval = async (req, res) => {
  try {
    const id = req.params.id;
    const isApproved = req.body.isApproved;
    await paperApproval(id, isApproved);
    res.status(200).json({ message: "Status changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark the paper
exports.markPaper = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const answers = req.body.answers;
    const timeSpent = req.body.timeSpent;

    const questions = await markPaper(paperId, req.user.id, answers, timeSpent);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check paper eligibility
exports.checkEligibility = async (req, res) => {
  try {
    const paperId = req.params.paperId;

    const questions = await checkEligibility(paperId, req.user.id);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

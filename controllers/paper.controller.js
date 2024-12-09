const {
  create,
  findAll,
  getGroupedPapers,
  getPapersByExamAndMedium,
  findOne,
  update,
  remove,
  markPaper,
} = require("../services/paper.service");

// Create a paper
exports.create = async (req, res) => {
  try {
    const paper = await create(req.body);
    res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find all papers with optional query parameters
exports.findAll = async (req, res) => {
  try {
    const { exam, medium, type } = req.query;
    const papers = await findAll({ exam, medium, type });
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Get grouped papers
// exports.getGroupedPapers = async (req, res) => {
//   try {
//     console.log("first");
//     const groupedPapers = await getGroupedPapers();
//     res.status(200).json(groupedPapers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get papers grouped by exam and medium
// exports.getPapersByExamAndMedium = async (req, res) => {
//   try {
//     const { exam, medium } = req.query;
//     const papersByExamAndMedium = await getPapersByExamAndMedium({
//       exam,
//       medium,
//     });
//     res.status(200).json(papersByExamAndMedium);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
    console.log("id", id);
    await remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark the paper
exports.markPaper = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const answers = req.body.answers;

    const questions = await markPaper(paperId, req.user.id, answers);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const {
  create,
  findAll,
  findOne,
  getAllLessonsByPaperId,
  getHighestMarkStudentsByPaperId,
  getMyResults,
} = require("../services/mark.service");

// Create a mark
exports.create = async (req, res) => {
  try {
    const mark = await create(req.body);
    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Find all marks with optional query parameter
// exports.findAll = async (req, res) => {
//   try {
//     const exam = req.query.exam;
//     const marks = await findAll({ exam });
//     res.status(200).json(marks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Find a mark by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const mark = await findOne(id);
    if (mark) {
      res.status(200).json(mark);
    } else {
      res.status(404).json({ message: "Marks not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// find all marks by paperId
exports.getHighestMarkStudentsByPaperId = async (req, res) => {
  try {
    const mark = await getHighestMarkStudentsByPaperId(req.params.paperId);
    if (mark) {
      res.status(200).json(mark);
    } else {
      res.status(404).json({ message: "Marks not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// find all marks by paperId
exports.getMyResults = async (req, res) => {
  try {
    const mark = await getMyResults(req.user.id);
    if (mark) {
      res.status(200).json(mark);
    } else {
      res.status(404).json({ message: "Marks not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

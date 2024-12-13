const {
  create,
  findAll,
  findOne,
  update,
  remove,
  getAllLessonsByPaperId,
} = require("../services/lesson.service");
const { validateLesson } = require("../validators/lesson.validator");

// Create a lesson
exports.create = async (req, res) => {
  try {
    const { isValid, errors } = validateLesson(req.body);

    // If validation fails, return a 400 error
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const lesson = await create(req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find all lessons with optional query parameter
exports.findAll = async (req, res) => {
  try {
    const exam = req.query.exam;
    const lessons = await findAll({ exam });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all lessons by paper ID
exports.getAllLessonsByPaperId = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const lessons = await getAllLessonsByPaperId(paperId);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find a lesson by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const lesson = await findOne(id);
    if (lesson) {
      res.status(200).json(lesson);
    } else {
      res.status(404).json({ message: "Lesson not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a lesson by ID
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedLesson = await update(id, req.body);
    res.status(200).json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a lesson by ID
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    await remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

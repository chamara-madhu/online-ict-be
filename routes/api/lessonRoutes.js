const express = require("express");
const router = express.Router();
const lessonController = require("../../controllers/lesson.controller");
const { isAuth, isAdmin } = require("../../auth-middleware/check");

// Route to create a new lesson
router.post("/", isAuth, isAdmin, lessonController.create);

// Route to update an existing lesson
router.put("/:id", isAuth, isAdmin, lessonController.update);

// Route to get all lessons
router.get("/", isAuth, lessonController.findAll);

// Route to get a lesson by ID
router.get("/:id", isAuth, lessonController.findOne);

// Route to get lessons by paper ID
router.get(
  "/by-paper/:paperId",
  isAuth,
  lessonController.getAllLessonsByPaperId
);

// Route to delete a lesson
router.delete("/:id", isAuth, isAdmin, lessonController.remove);

module.exports = router;

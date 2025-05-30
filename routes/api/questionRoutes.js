const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const questionController = require("../../controllers/question.controller");
const { isAuth, isAdmin } = require("../../auth-middleware/check");

// Route to create a new question
router.post("/", isAuth, isAdmin, questionController.create);

router.post("/scan", isAuth, isAdmin, upload.single("file"), questionController.scan);

// Route to update an existing question
router.put("/:id", isAuth, isAdmin, questionController.update);

// Route to get all questions
router.get("/", isAuth, questionController.findAll);

// Route to get a question by ID
router.get("/:id", isAuth, questionController.findOne);

// Route to get questions by paper ID
router.get("/by-papers/:paperId", questionController.getAllQuestionsByPaperId);

// Route to get questions and answers by paper ID
router.get(
  "/answers/by-papers/:paperId",
  questionController.getAllQuestionsAndAnswersByPaperId
);

// Route to delete a question
router.delete("/:id", isAuth, isAdmin, questionController.remove);

module.exports = router;

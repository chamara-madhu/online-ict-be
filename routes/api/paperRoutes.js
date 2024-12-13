const express = require("express");
const router = express.Router();
const paperController = require("../../controllers/paper.controller");
const { isAuth, isAdmin, isStudent } = require("../../auth-middleware/check");

// Route to create a new paper
router.post("/", isAuth, isAdmin, paperController.create);

// Route to update an existing paper
router.put("/:id", isAuth, isAdmin, paperController.update);

// Route to get all papers
router.get("/", paperController.findAll);

// Route to get a paper by ID
router.get("/:id", paperController.findOne);

// Route to delete a paper
router.delete("/:id", isAuth, isAdmin, paperController.remove);

// Route to mark a paper (student action)
router.post("/marks/:paperId", isAuth, isStudent, paperController.markPaper);

// Check eligibility to do the paper
router.get(
  "/eligibility/:paperId",
  isAuth,
  isStudent,
  paperController.checkEligibility
);

module.exports = router;

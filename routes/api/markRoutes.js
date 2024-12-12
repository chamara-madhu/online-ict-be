const express = require("express");
const router = express.Router();
const markController = require("../../controllers/mark.controller");
const { isAuth, isStudent } = require("../../auth-middleware/check");

// Route to get a mark by ID
router.get("/:id", isAuth, isStudent, markController.findOne);

// Route to get all highest mark students by paperId
router.get("/highest/:paperId", markController.getHighestMarkStudentsByPaperId);

// Route to get all my results
router.get("/my/results", isAuth, isStudent, markController.getMyResults);

module.exports = router;

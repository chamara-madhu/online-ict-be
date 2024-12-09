const express = require("express");
const router = express.Router();
const markController = require("../../controllers/mark.controller");
const { isAuth, isAdmin } = require("../../auth-middleware/check");

// Route to get a mark by ID
router.get("/:id", isAuth, markController.findOne);

// Route to get all highest mark students by paperId
router.get("/highest/:paperId", markController.getHighestMarkStudentsByPaperId);

module.exports = router;

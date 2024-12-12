const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const { isAuth, isAdmin } = require("../../auth-middleware/check");

// Route to get all users
router.get("/", isAuth, isAdmin, userController.findAll);

module.exports = router;

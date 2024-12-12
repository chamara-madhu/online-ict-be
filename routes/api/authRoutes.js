const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");

// use login
router.post("/login", authController.userLogin);

// user sign up
router.post("/sign-up", authController.userSignUp);

module.exports = router;

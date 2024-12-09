const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/dashboardController");
const { isAuth, isAdmin } = require("../../auth-middleware/check");

router.get("/stats/user", isAuth, isAdmin, dashboardController.userStats);

module.exports = router;

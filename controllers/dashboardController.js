const { userStats, paperStats } = require("../services/dashboardService");

exports.userStats = (req, res) => {
  return userStats(res);
};

exports.paperStats = (req, res) => {
  return paperStats(res);
};

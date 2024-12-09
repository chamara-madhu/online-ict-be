const { userStats } = require("../services/dashboardService");

exports.userStats = (req, res) => {
  return userStats(res);
};

const Paper = require("../models/paper.model");
const User = require("../models/user.model");

exports.userStats = (res) => {
  User.aggregate([
    { $group: { _id: { role: "$role" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(400).json({ error: "no active users" });
    });
};

exports.paperStats = (res) => {
  Paper.aggregate([
    { $group: { _id: { exam: "$exam" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

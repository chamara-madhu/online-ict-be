const SeasonTicket = require("../models/paper.model");
const User = require("../models/userModel");

// exports.userStats = (res) => {
//   User.aggregate([
//     { $group: { _id: { role: "$role" }, count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//   ])
//     .then((data) => {
//       if (data.length > 0) {
//         res.status(200).json(data);
//       }
//     })
//     .catch((err) => {
//       res.status(400).json({ error: "no active users" });
//     });
// };

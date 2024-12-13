const { findAll } = require("../services/user.service");

// Find all users
exports.findAll = async (req, res) => {
  try {
    const users = await findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

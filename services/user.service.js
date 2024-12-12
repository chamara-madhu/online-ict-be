const User = require("../models/user.model");

class UserService {
  async findAll() {
    return await User.find().select("name email role");
  }
}

module.exports = new UserService();

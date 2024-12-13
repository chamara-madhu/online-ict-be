const Mark = require("../models/mark.model");

class MarkService {
  async create(createMarkDto) {
    const mark = new Mark(createMarkDto);
    return await mark.save();
  }

  async findOne(id) {
    return await Mark.findById(id)
      .populate("paper", "longName")
      .populate("user", "name");
  }

  async getHighestMarkStudentsByPaperId(paperId) {
    return await Mark.find({ paper: paperId, marks: { $gt: 50 } })
      .sort({ marks: -1 })
      .select("marks medal")
      .populate("user", "name")
      .limit(10);
  }

  async getMyResults(userId) {
    return await Mark.find({ user: userId }).populate("paper", "longName");
  }
}

module.exports = new MarkService();

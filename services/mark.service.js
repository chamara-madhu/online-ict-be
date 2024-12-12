const Mark = require("../models/mark.model");

class MarkService {
  async create(createMarkDto) {
    const mark = new Mark(createMarkDto);
    return await mark.save();
  }

  // async findAll(query) {
  //   const { exam } = query;
  //   const filter = {};

  //   if (exam) {
  //     filter.exam = exam;
  //   }

  //   return await Mark.find(filter)
  //     .sort({ no: 1 })
  //     .select("id exam no mark");
  // }

  // async getAllMarksByMarkId(markId) {
  //   const mark = await Mark.findById(markId);

  //   if (!mark) {
  //     throw new Error(`Mark with ID ${markId} not found`);
  //   }

  //   return Mark.find({ exam: mark.exam });
  // }

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

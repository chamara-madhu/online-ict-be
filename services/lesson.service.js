const Lesson = require("../models/lesson.model");
const Paper = require("../models/paper.model");

class LessonService {
  async create(createLessonDto) {
    const lesson = new Lesson(createLessonDto);
    return await lesson.save();
  }

  async findAll(query) {
    const { exam } = query;
    const filter = {};

    if (exam) {
      filter.exam = exam;
    }

    return await Lesson.find(filter)
      .sort({ no: 1 })
      .select("id exam no lesson");
  }

  async getAllLessonsByPaperId(paperId) {
    const paper = await Paper.findById(paperId);

    if (!paper) {
      throw new Error(`Paper with ID ${paperId} not found`);
    }

    return Lesson.find({ exam: paper.exam });
  }

  async findOne(id) {
    return await Lesson.findById(id);
  }

  async update(id, updateLessonDto) {
    return await Lesson.findByIdAndUpdate(id, updateLessonDto, {
      new: true,
    });
  }

  async remove(id) {
    await Lesson.findByIdAndDelete(id);
  }
}

module.exports = new LessonService();

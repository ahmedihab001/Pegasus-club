// repositories/ProgramRepository.js
const Program = require("../models/Program");

class ProgramRepository {
  async findAll() {
    return Program.find();
  }

  async findById(id) {
    return Program.findById(id);
  }
async findByCoachId(coachId) {
  return Program.find({ coachId });
}
  async create(programData) {
    const program = new Program(programData);
    return program.save();
  }

  async update(id, updateData) {
    return Program.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return Program.findByIdAndDelete(id);
  }

  async incrementEnrolledCount(id, increment = 1) {
    return Program.findByIdAndUpdate(
      id,
      { $inc: { enrolledCount: increment } },
      { new: true }
    );
  }
}

module.exports = ProgramRepository;
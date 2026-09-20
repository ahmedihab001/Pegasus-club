const ProgramEnrollment = require("../models/ProgramEnrollment");

class ProgramEnrollmentRepository {
  async create(data) { return ProgramEnrollment.create(data); }
  async findOne(query) { return ProgramEnrollment.findOne(query); }
  async findOneAndDelete(query) { return ProgramEnrollment.findOneAndDelete(query); }
  async findByUserId(userId) { return ProgramEnrollment.find({ userId }); }
  async findByProgramId(programId) { return ProgramEnrollment.find({ programId }).populate("userId", "name email memberNumber"); }
  async deleteManyByProgramId(programId) { return ProgramEnrollment.deleteMany({ programId }); }
}
module.exports = ProgramEnrollmentRepository;
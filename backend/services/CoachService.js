class CoachService {
  constructor(programRepository, programEnrollmentRepository) {
    this.programRepo = programRepository;
    this.enrollmentRepo = programEnrollmentRepository;
  }

  async getMyPrograms(coachId) {
    return this.programRepo.findByCoachId(coachId);
  }

  async createProgram(coachId, programData, coachName) {
    const newProgram = {
      ...programData,
      coachId,
      coach: coachName,
    };
    return this.programRepo.create(newProgram);
  }

  async getEnrollmentsForProgram(programId, coachId) {
    const program = await this.programRepo.findById(programId);
    if (!program || program.coachId.toString() !== coachId.toString()) {
      throw new Error("Unauthorized");
    }
    return this.enrollmentRepo.findByProgramId(programId);
  }

  async updateMyProgram(programId, coachId, updateData) {
    const program = await this.programRepo.findById(programId);
    if (!program || program.coachId.toString() !== coachId.toString()) {
      throw new Error("Unauthorized");
    }
    return this.programRepo.update(programId, updateData);
  }

  async deleteMyProgram(programId, coachId) {
    const program = await this.programRepo.findById(programId);
    if (!program || program.coachId.toString() !== coachId.toString()) {
      throw new Error("Unauthorized");
    }
    await this.enrollmentRepo.deleteManyByProgramId(programId);
    return this.programRepo.deleteById(programId);
  }
}
module.exports = CoachService;
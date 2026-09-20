// services/ProgramService.js
class ProgramService {
  constructor(programRepository, enrollmentRepository) {
    this.programRepo = programRepository;
    this.enrollmentRepo = enrollmentRepository;
  }

  async getAllPrograms() {
    return this.programRepo.findAll();
  }

  async getProgramById(id) {
    const program = await this.programRepo.findById(id);
    if (!program) throw new Error("Program not found");
    return program;
  }

  async createProgram(programData) {
    return this.programRepo.create(programData);
  }

  async updateProgram(id, updateData) {
    const updated = await this.programRepo.update(id, updateData);
    if (!updated) throw new Error("Program not found");
    return updated;
  }

  async deleteProgram(id) {
    const program = await this.programRepo.deleteById(id);
    if (!program) throw new Error("Program not found");
    // Cascade delete enrollments
    await this.enrollmentRepo.deleteManyByProgramId(id);
    return { message: "Program deleted" };
  }

  async enrollUser(userId, userName, programId) {
    if (!userId) throw new Error("userId is required");

    const program = await this.programRepo.findById(programId);
    if (!program) throw new Error("Program not found");

    // Check duplicate enrollment
    const existing = await this.enrollmentRepo.findOne({ userId, programId });
    if (existing) throw new Error("You are already enrolled in this program!");

    // Check capacity
    if (program.enrolledCount >= program.capacity) {
      throw new Error("Program is full!");
    }

    // Create enrollment
    const enrollment = await this.enrollmentRepo.create({
      userId,
      userName: userName || "User",
      programId,
      programName: program.name,
      coach: program.coach,
      duration: program.duration,
      price: program.price,
      schedule: program.schedule,
      enrolledAt: new Date()
    });

    // Increment enrolledCount
    await this.programRepo.incrementEnrolledCount(programId, 1);

    return {
      message: "✅ Successfully enrolled in program!",
      enrollment: {
        id: enrollment._id,
        userId: enrollment.userId,
        userName: enrollment.userName,
        programId: enrollment.programId,
        programName: enrollment.programName,
        coach: enrollment.coach,
        duration: enrollment.duration,
        price: enrollment.price,
        schedule: enrollment.schedule,
        enrolledAt: enrollment.enrolledAt
      }
    };
  }

  async cancelEnrollment(userId, programId) {
    if (!userId) throw new Error("userId is required");

    const enrollment = await this.enrollmentRepo.findOneAndDelete({ userId, programId });
    if (!enrollment) throw new Error("Enrollment not found");

    // Decrement enrolledCount
    await this.programRepo.incrementEnrolledCount(programId, -1);

    return { message: "Enrollment cancelled successfully" };
  }

  async getUserEnrollments(userId) {
    return this.enrollmentRepo.findByUserId(userId);
  }

  async checkEnrollment(userId, programId) {
    if (!userId) throw new Error("userId query param required");
    const enrollment = await this.enrollmentRepo.findOne({ userId, programId });
    return { enrolled: !!enrollment };
  }
}

module.exports = ProgramService;
// src/services/ProgramService.js
class ProgramService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  getAllPrograms() {
    return this.api.get("/programs");
  }

  getProgramById(programId) {
    return this.api.get(`/programs/${programId}`);
  }

  getUserEnrollments(userId) {
    return this.api.get(`/programs/user/${userId}/enrollments`);
  }

  enrollInProgram(programId, userId, userName) {
    return this.api.post(`/programs/${programId}/enroll`, { userId, userName });
  }

  cancelEnrollment(programId, userId) {
    return this.api.delete(`/programs/${programId}/enroll`, { data: { userId } });
  }

  checkEnrollmentStatus(programId, userId) {
    return this.api.get(`/programs/${programId}/check-enrollment?userId=${userId}`);
  }
}

export default ProgramService;
// frontendd/src/services/CoachService.js
class CoachService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  getMyPrograms() {
    return this.api.get("/coach/programs");
  }

  createProgram(programData) {
    return this.api.post("/coach/programs", programData);
  }

  getProgramEnrollments(programId) {
    return this.api.get(`/coach/programs/${programId}/enrollments`);
  }

  updateProgram(programId, data) {
    return this.api.put(`/coach/programs/${programId}`, data);
  }

  deleteProgram(programId) {
    return this.api.delete(`/coach/programs/${programId}`);
  }
}

export default CoachService;
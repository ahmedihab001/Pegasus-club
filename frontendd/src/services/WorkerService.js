// frontendd/src/services/WorkerService.js
class WorkerService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  getWorkers(role = "all") {
    return this.api.get(`/workers?role=${role}`);
  }

  updateUserRole(userId, role) {
    return this.api.put(`/workers/${userId}/role`, { role });
  }
}

export default WorkerService;
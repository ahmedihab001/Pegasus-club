// backend/services/WorkerService.js
class WorkerService {
  constructor(userRepository) {
    this.userRepo = userRepository;
  }

  async getWorkersByRole(role) {
    if (role === "all") {
      return this.userRepo.findAll();
    }
    return this.userRepo.findByRole(role);
  }

  async getAllWorkers() {
    return this.userRepo.findAll();
  }

  async updateUserRole(userId, newRole) {
    const updated = await this.userRepo.update(userId, { role: newRole });
    if (!updated) throw new Error("User not found");
    return updated;
  }
}

module.exports = WorkerService;
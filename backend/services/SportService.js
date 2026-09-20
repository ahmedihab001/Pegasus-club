// services/SportService.js
class SportService {
  constructor(sportRepository) {
    this.sportRepo = sportRepository;
  }

  async getAllSports() {
    return this.sportRepo.findAll();
  }

  async getSportById(id) {
    const sport = await this.sportRepo.findById(id);
    if (!sport) throw new Error("Sport not found");
    return sport;
  }

  async createSport(sportData) {
    // Remove _id if present
    const { _id, ...data } = sportData;
    return this.sportRepo.create(data);
  }

  async updateSport(id, updateData) {
    const { _id, ...data } = updateData;
    const updated = await this.sportRepo.update(id, data);
    if (!updated) throw new Error("Sport not found");
    return updated;
  }

  async deleteSport(id) {
    const deleted = await this.sportRepo.deleteById(id);
    if (!deleted) throw new Error("Sport not found");
    return { message: "Sport deleted successfully" };
  }

  async addCoachToSport(sportId, coachData) {
    return this.sportRepo.addCoach(sportId, coachData);
  }
}

module.exports = SportService;
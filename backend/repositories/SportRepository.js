// repositories/SportRepository.js
const Sport = require("../models/Sport");

class SportRepository {
  async findAll() {
    return Sport.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return Sport.findById(id);
  }

  async create(sportData) {
    const sport = new Sport(sportData);
    return sport.save();
  }

  async update(id, updateData) {
    return Sport.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return Sport.findByIdAndDelete(id);
  }

  async addCoach(sportId, coachData) {
    const sport = await this.findById(sportId);
    if (!sport) throw new Error("Sport not found");
    sport.coaches.push(coachData);
    await sport.save();
    return sport;
  }
}

module.exports = SportRepository;
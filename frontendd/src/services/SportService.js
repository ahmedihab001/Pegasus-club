// src/services/SportService.js
class SportService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  getAllSports() {
    return this.api.get("/sports");
  }

  getSportById(id) {
    return this.api.get(`/sports/${id}`);
  }

  createSport(sportData) {
    return this.api.post("/sports", sportData);
  }

  updateSport(id, sportData) {
    return this.api.put(`/sports/${id}`, sportData);
  }

  deleteSport(id) {
    return this.api.delete(`/sports/${id}`);
  }

  addCoachToSport(sportId, coachData) {
    return this.api.post(`/sports/${sportId}/coaches`, coachData);
  }
}

export default SportService;
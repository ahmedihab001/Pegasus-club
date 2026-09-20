// src/services/AdminService.js
class AdminService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  getAllUsers() {
    return this.api.get("/admin/users");
  }

  createUser(userData) {
    return this.api.post("/admin/users", userData);
  }

  updateUser(userId, updateData) {
    return this.api.put(`/admin/users/${userId}`, updateData);
  }

  deleteUser(userId) {
    return this.api.delete(`/admin/users/${userId}`);
  }
}

export default AdminService;
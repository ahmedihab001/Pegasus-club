// repositories/UserRepository.js
const User = require("../models/User");

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findOne(query) {
    return User.findOne(query);
  }

  async findLastUserByRole(role) {
    return User.findOne({ role }).sort({ memberNumber: -1 });
  }

  async save(user) {
    return user.save();
  }
  // Add to UserRepository class:

async findAll() {
  return User.find();
}
async findByRole(role) {
  return User.find({ role });
}
async deleteById(id) {
  return User.findByIdAndDelete(id);
}
}

module.exports = UserRepository;
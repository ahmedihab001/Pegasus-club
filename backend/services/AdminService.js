// services/AdminService.js
const bcrypt = require("bcryptjs");

class AdminService {
  constructor(userRepository, bookingRepository) {
    this.userRepo = userRepository;
    this.bookingRepo = bookingRepository;
  }

  // Helper: next user number (Number)
  async getNextUserNumber() {
    const lastUser = await this.userRepo.findLastUserByRole("user");
    if (!lastUser || !lastUser.memberNumber) return 1;
    return lastUser.memberNumber + 1;
  }

  // Helper: next admin number (String with leading zero)
  async getNextAdminNumber() {
    const lastAdmin = await this.userRepo.findLastUserByRole("admin");
    if (!lastAdmin || !lastAdmin.memberNumber) return "01";
    const next = parseInt(lastAdmin.memberNumber, 10) + 1;
    return next < 10 ? `0${next}` : next.toString();
  }

  async getAllUsers() {
    const users = await this.userRepo.findAll();
    // Remove passwords
    return users.map(user => {
      const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
      return userWithoutPassword;
    });
  }

  async createUser(userData) {
    const { name, email, password, role } = userData;
    
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    let memberNumber;
    if (role === "admin") {
      memberNumber = await this.getNextAdminNumber();
    } else {
      memberNumber = await this.getNextUserNumber();
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      memberNumber,
      createdAt: startDate,
      membershipEndDate: endDate,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberNumber: user.memberNumber,
    };
  }

  async updateUser(userId, updateData) {
    const { name, email, password, role } = updateData;
    const dataToUpdate = {};
    
    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (role !== undefined) dataToUpdate.role = role;
    if (password && password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.userRepo.update(userId, dataToUpdate);
    if (!updatedUser) throw new Error("User not found");

    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  async deleteUser(userId) {
    // Delete all bookings of this user
    await this.bookingRepo.deleteManyByUserId(userId);
    const deleted = await this.userRepo.deleteById(userId);
    if (!deleted) throw new Error("User not found");
    return { message: "User and their bookings deleted" };
  }
}

module.exports = AdminService;
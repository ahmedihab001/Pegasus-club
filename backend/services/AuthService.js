// services/AuthService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

class AuthService {
  constructor(userRepository) {
    this.userRepo = userRepository;
    
    // Setup email transporter (could be injected as dependency later)
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Helper: get next member number for regular users (Number)
  async getNextUserNumber() {
    const lastUser = await this.userRepo.findLastUserByRole("user");
    if (!lastUser || !lastUser.memberNumber) return 1;
    return lastUser.memberNumber + 1;
  }

  // Helper: get next member number for admins (String with leading zero)
  async getNextAdminNumber() {
    const lastAdmin = await this.userRepo.findLastUserByRole("admin");
    if (!lastAdmin || !lastAdmin.memberNumber) return "01";
    const lastNum = parseInt(lastAdmin.memberNumber, 10);
    const next = lastNum + 1;
    return next < 10 ? `0${next}` : next.toString();
  }

  async signup(name, email, password) {
    // Check existing user
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const memberNumber = await this.getNextUserNumber();
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      memberNumber,
      createdAt: startDate,
      membershipEndDate: endDate,
    });

    // Return user without password
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberNumber: user.memberNumber,
      createdAt: user.createdAt,
      membershipEndDate: user.membershipEndDate,
    };
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid email or password");

const token = jwt.sign(
  { id: user._id, name: user.name, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberNumber: user.memberNumber,
        createdAt: user.createdAt,
        membershipEndDate: user.membershipEndDate,
      },
      token,
    };
  }

  async forgotPassword(email) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("No account found with this email");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await this.userRepo.save(user);

    try {
      await this.transporter.sendMail({
        from: `"Pegasus Club" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}\nIt expires in 10 minutes.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });
    } catch (emailErr) {
      console.error(emailErr);
      throw new Error("Failed to send OTP");
    }

    return { message: "OTP sent to your email", email: user.email };
  }

  async verifyOtp(email, otp) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.resetOTP !== otp) throw new Error("Invalid OTP");
    if (user.resetOTPExpiry < new Date()) throw new Error("OTP expired");
    return { message: "OTP verified", verified: true };
  }

  async resetPassword(email, otp, newPassword) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.resetOTP !== otp) throw new Error("Invalid OTP");
    if (user.resetOTPExpiry < new Date()) throw new Error("OTP expired");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await this.userRepo.save(user);

    return { message: "Password reset successfully" };
  }

  async createAdmin() {
    const existingAdmin = await this.userRepo.findOne({ role: "admin" });
    if (existingAdmin) throw new Error("Admin already exists");

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    const memberNumber = await this.getNextAdminNumber();

    const admin = await this.userRepo.create({
      name: "Administrator",
      email: "admin@pegasus.com",
      password: hashedPassword,
      role: "admin",
      memberNumber,
      membershipEndDate: endDate,
    });

    return {
      message: "Admin created successfully",
      admin: {
        email: admin.email,
        password: "admin123",
        role: admin.role,
      },
    };
  }
}

module.exports = AuthService;
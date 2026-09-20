// src/services/AuthService.js
class AuthService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  signup(name, email, password) {
    return this.api.post("/auth/signup", { name, email, password });
  }

  login(email, password) {
    return this.api.post("/auth/login", { email, password });
  }

  forgotPassword(email) {
    return this.api.post("/auth/forgot-password", { email });
  }

  verifyOtp(email, otp) {
    return this.api.post("/auth/verify-otp", { email, otp });
  }

  resetPassword(email, otp, newPassword) {
    return this.api.post("/auth/reset-password", { email, otp, newPassword });
  }

  createAdmin() {
    return this.api.post("/auth/create-admin");
  }
}

export default AuthService;
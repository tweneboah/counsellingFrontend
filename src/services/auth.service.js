import api from "./api";

const AuthService = {
  // Register a new student
  registerStudent: async (userData) => {
    const response = await api.post("/auth/register/student", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user (student or counselor)
  login: async (email, password, userType) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      userType,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return api.post("/auth/logout");
  },

  // Get the current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },

  // Get user role
  getUserRole: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).role : null;
  },

  // Forgot password
  forgotPassword: async (email, userType) => {
    return await api.post("/auth/forgot-password", { email, userType });
  },

  // Reset password
  resetPassword: async (token, password, userType) => {
    return await api.post("/auth/reset-password", {
      token,
      password,
      userType,
    });
  },

  // Validate reset token
  validateResetToken: async (token, userType) => {
    return await api.post("/auth/validate-reset-token", {
      token,
      userType,
    });
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};

export default AuthService;

import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const user = AuthService.getCurrentUser();
    console.log("Current user from localStorage:", user);
    if (user) {
      setCurrentUser(user);
      // Check if the user needs onboarding
      const hasOnboarded = localStorage.getItem(`onboarded_${user.id}`);
      setNeedsOnboarding(user.role === "student" && !hasOnboarded);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      setError(null);
      setLoading(true);
      const response = await AuthService.login(email, password, userType);
      console.log("Login response:", response);

      if (response.status === "success") {
        setCurrentUser(response.data.user);
        console.log("Setting current user to:", response.data.user);

        // Check if this is a first-time login for a student
        const userId = response.data.user.id;
        const hasOnboarded = localStorage.getItem(`onboarded_${userId}`);
        const isStudent = response.data.user.role === "student";

        if (isStudent && !hasOnboarded) {
          setNeedsOnboarding(true);
        }
      }

      return response;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to login");
      return {
        status: "fail",
        message: err.response?.data?.message || "Failed to login",
      };
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await AuthService.registerStudent(userData);

      if (response.status === "success") {
        setCurrentUser(response.data.user);
        // New registration always needs onboarding
        setNeedsOnboarding(true);
      }

      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
      return {
        status: "fail",
        message: err.response?.data?.message || "Failed to register",
      };
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = (onboardingData) => {
    if (currentUser) {
      // Store onboarding data
      localStorage.setItem(`onboarded_${currentUser.id}`, "true");
      localStorage.setItem(
        `onboarding_data_${currentUser.id}`,
        JSON.stringify(onboardingData)
      );
      setNeedsOnboarding(false);
      setOnboardingCompleted(true);

      // You could also send this data to the backend
      // AuthService.saveOnboardingData(currentUser.id, onboardingData);
    }
  };

  const getOnboardingData = () => {
    if (currentUser) {
      const data = localStorage.getItem(`onboarding_data_${currentUser.id}`);
      return data ? JSON.parse(data) : null;
    }
    return null;
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setNeedsOnboarding(false);
    setOnboardingCompleted(false);
  };

  const forgotPassword = async (email, userType) => {
    try {
      setError(null);
      setLoading(true);
      return await AuthService.forgotPassword(email, userType);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password, userType) => {
    try {
      setError(null);
      setLoading(true);
      return await AuthService.resetPassword(token, password, userType);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setLoading(true);
      return await AuthService.changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    registerStudent,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    isLoggedIn: !!currentUser,
    userRole: currentUser?.role || null,
    needsOnboarding,
    completeOnboarding,
    onboardingCompleted,
    getOnboardingData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

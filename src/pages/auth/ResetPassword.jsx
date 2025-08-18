import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import AuthService from "../../services/auth.service";

// Form validation schema
const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Extract token and userType from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get("token");
    const resetUserType = searchParams.get("userType") || "student"; // Default to student for backward compatibility

    if (!resetToken) {
      setError("Reset token is missing");
      setTokenExpired(true);
      return;
    }

    setToken(resetToken);
    setUserType(resetUserType);

    // Validate token
    const validateToken = async () => {
      try {
        const response = await AuthService.validateResetToken(resetToken, resetUserType);

        if (response.data.status !== "success") {
          setError(response.data.message || "Invalid or expired reset token");
          setTokenExpired(true);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setError(
          error.response?.data?.message || 
          "Failed to validate reset token"
        );
        setTokenExpired(true);
      }
    };

    validateToken();
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (score < 4) return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (score < 5) return { strength: 3, label: "Good", color: "bg-blue-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await AuthService.resetPassword(token, data.password, userType);

      if (response.data.status === "success") {
        setSuccess(true);

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Password has been reset successfully. You can now log in with your new password.",
            },
          });
        }, 3000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(
        error.response?.data?.message || 
        "An error occurred while resetting your password"
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003049] via-[#003049] to-[#d62828] flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header with Logo/Icon */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
          <p className="text-blue-100">Choose a strong password for your account</p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-white/95"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You will be redirected to the login page.
              </p>
              <motion.div
                className="w-full bg-gray-200 rounded-full h-2 mb-4"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
              >
                <motion.div
                  className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                />
              </motion.div>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </motion.div>
          ) : tokenExpired ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#d62828] to-red-600 rounded-full flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Link Expired</h3>
              <p className="text-gray-600 mb-6">
                {error || "Your password reset link has expired or is invalid."}
              </p>
              <Link
                to="/forgot-password"
                className="inline-flex items-center bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Request a New Reset Link
              </Link>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-[#d62828] text-[#d62828] rounded-lg text-sm flex items-center"
                >
                  <div className="w-5 h-5 rounded-full bg-[#d62828] flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">!</span>
                  </div>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-[#003049]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-[#003049] transition-colors" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-[#003049] transition-colors" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Password Strength</span>
                        <span className={`text-xs font-semibold ${
                          passwordStrength.strength === 1 ? "text-red-500" :
                          passwordStrength.strength === 2 ? "text-yellow-500" :
                          passwordStrength.strength === 3 ? "text-blue-500" : "text-green-500"
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-2 text-sm text-[#d62828] flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-[#003049]" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-[#003049] transition-colors" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-[#003049] transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-[#d62828] flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </motion.div>

                {/* Password Requirements */}
                <motion.div variants={itemVariants} className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <span className={`mr-2 ${password && password.length >= 8 ? "text-green-500" : "text-gray-400"}`}>
                        {password && password.length >= 8 ? "✓" : "○"}
                      </span>
                      At least 8 characters long
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${password && /[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"}`}>
                        {password && /[A-Z]/.test(password) ? "✓" : "○"}
                      </span>
                      Contains uppercase letter
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${password && /[a-z]/.test(password) ? "text-green-500" : "text-gray-400"}`}>
                        {password && /[a-z]/.test(password) ? "✓" : "○"}
                      </span>
                      Contains lowercase letter
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${password && /[0-9]/.test(password) ? "text-green-500" : "text-gray-400"}`}>
                        {password && /[0-9]/.test(password) ? "✓" : "○"}
                      </span>
                      Contains number
                    </li>
                  </ul>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FiShield className="mr-2 h-5 w-5" />
                        Reset Password
                      </div>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Footer */}
              <motion.div variants={itemVariants} className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-[#003049] hover:text-[#f77f00] font-semibold transition-colors inline-flex items-center"
                  >
                    <FiArrowLeft className="mr-1 h-4 w-4" />
                    Back to Sign In
                  </Link>
                </p>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Bottom decorative elements */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#fcbf49] rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

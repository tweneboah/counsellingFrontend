import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiLogIn,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { Button } from "../ui";
import { FormContainer, FormGroup, FormActions, FormField } from "../forms";
import { useAuth } from "../../contexts/AuthContext";

// Form validation schema
const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  userType: yup.string().required("User type is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      userType: "student",
    },
  });

  const selectedUserType = watch("userType");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiError("");

      // Call login function from auth context
      const response = await login(data.email, data.password, data.userType);

      if (response.status === "success") {
        // Redirect based on user role
        if (response.data.user.role === "student") {
          navigate("/dashboard");
        } else if (
          response.data.user.role === "counselor" ||
          response.data.user.role === "admin"
        ) {
          navigate("/admin");
        }
      } else {
        setApiError(
          response.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      setApiError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
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
            <FiLogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-blue-100">Sign in to continue your journey</p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-white/95"
        >
          {apiError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-[#d62828] text-[#d62828] rounded-lg text-sm flex items-center"
            >
              <div className="w-5 h-5 rounded-full bg-[#d62828] flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white text-xs">!</span>
              </div>
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Type Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiUser className="inline mr-2 text-[#003049]" />I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "student", label: "Student", icon: "📚" },
                  { value: "counselor", label: "Counselor/Admin", icon: "👨‍⚕️" },
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register("userType")}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group ${
                        selectedUserType === option.value
                          ? "border-[#f77f00] bg-[#f77f00]/5"
                          : "border-gray-200 hover:border-[#f77f00]"
                      }`}
                    >
                      <span className="text-2xl mr-2">{option.icon}</span>
                      <span
                        className={`font-medium ${
                          selectedUserType === option.value
                            ? "text-[#003049]"
                            : "text-gray-700 group-hover:text-[#003049]"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selectedUserType === option.value && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2"
                        >
                          <FiCheck className="w-5 h-5 text-[#f77f00]" />
                        </motion.div>
                      )}
                    </div>
                  </motion.label>
                ))}
              </div>
              {errors.userType && (
                <p className="mt-2 text-sm text-[#d62828]">
                  {errors.userType.message}
                </p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#003049]" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-[#d62828] flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#003049]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="mt-2 text-sm text-[#d62828] flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#f77f00] bg-gray-100 border-gray-300 rounded focus:ring-[#f77f00] focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#f77f00] hover:text-[#d62828] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#003049] hover:text-[#f77f00] font-semibold transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </motion.div>
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

export default LoginForm;

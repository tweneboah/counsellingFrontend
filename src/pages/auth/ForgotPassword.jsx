import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUser,
  FiArrowRight,
  FiArrowLeft,
  FiKey,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import AuthService from "../../services/auth.service";

// Form validation schema
const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  userType: yup
    .string()
    .oneOf(["student", "counselor"], "Please select a valid user type")
    .required("User type is required"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      userType: "",
    },
  });

  const selectedUserType = watch("userType");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await AuthService.forgotPassword(data.email, data.userType);

      if (response.data.status === "success") {
        setSuccess(true);
      } else {
        setError(
          response.data.message || "Failed to send password reset email"
        );
      }
    } catch (error) {
      console.error("Error in forgot password:", error);
      setError(
        error.response?.data?.message || 
        "An error occurred when trying to reset your password"
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
            <FiKey className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-blue-100">No worries! We'll help you reset it</p>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
              <p className="text-gray-600 mb-6">
                Please check your email for instructions to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center text-[#003049] hover:text-[#f77f00] font-semibold transition-colors"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
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
                {/* User Type Selection */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FiUser className="inline mr-2 text-[#003049]" />
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "student", label: "Student", icon: "📚" },
                      { value: "counselor", label: "Counselor", icon: "👨‍⚕️" },
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
                        <div className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group ${
                          selectedUserType === option.value
                            ? "border-[#f77f00] bg-[#f77f00]/5"
                            : "border-gray-200 hover:border-[#f77f00]"
                        }`}>
                          <span className="text-2xl mr-2">{option.icon}</span>
                          <span className={`font-medium ${
                            selectedUserType === option.value
                              ? "text-[#003049]"
                              : "text-gray-700 group-hover:text-[#003049]"
                          }`}>
                            {option.label}
                          </span>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                  {errors.userType && (
                    <p className="mt-2 text-sm text-[#d62828] flex items-center">
                      <span className="mr-1">⚠️</span>
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
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FiSend className="mr-2 h-5 w-5" />
                        Send Reset Link
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

export default ForgotPassword;

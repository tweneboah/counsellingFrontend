import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiShield, 
  FiHome, 
  FiKey,
  FiCheck,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiArrowRight
} from "react-icons/fi";
import { Button, Alert } from "../ui";
import AdminService from "../../services/admin.service";

// Form validation schema
const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  staffId: yup.string().required("Staff ID is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  department: yup.string().required("Department is required"),
  adminCode: yup.string().required("Admin registration code is required"),
});

const FormField = ({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required, 
  register, 
  errors, 
  icon: Icon,
  options,
  helperText,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword
}) => {
  const hasError = errors[name];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 text-[#f77f00]" />}
        {label}
        {required && <span className="text-[#d62828] ml-1">*</span>}
      </label>
      
      <div className="relative">
        {type === "select" ? (
          <select
            {...register(name)}
            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 ${
              hasError
                ? "border-[#d62828] bg-red-50"
                : "border-gray-200 focus:border-[#f77f00] bg-white hover:border-gray-300"
            }`}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            {...register(name)}
            className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 ${
              hasError
                ? "border-[#d62828] bg-red-50"
                : "border-gray-200 focus:border-[#f77f00] bg-white hover:border-gray-300"
            }`}
          />
        )}
        
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            hasError ? "text-[#d62828]" : "text-gray-400"
          }`} />
        )}
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {helperText && !hasError && (
        <p className="text-xs text-gray-500 flex items-center">
          <FiShield className="w-3 h-3 mr-1" />
          {helperText}
        </p>
      )}
      
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-[#d62828] flex items-center"
          >
            <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            {hasError.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RegisterAdminForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      gender: "",
      role: "admin",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      // Remove confirmPassword before sending to API
      const { confirmPassword, adminCode, ...counselorData } = data;

      // Set default admin permissions
      counselorData.permissions = {
        viewStudents: true,
        editProfiles: true,
        scheduleAppointments: true,
        viewReports: true,
        manageUsers: true,
      };

      counselorData.role = "admin";

      console.log("Registering admin:", counselorData);
      const response = await AdminService.registerAdmin(
        counselorData,
        adminCode
      );

      if (response.data && response.data.status === "success") {
        setSuccess(true);
        reset();
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Admin account created successfully! You can now login.",
            },
          });
        }, 2000);
      } else {
        setError(response.data?.message || "Failed to register admin");
      }
    } catch (error) {
      console.error("Error registering admin:", error);
      if (error.response) {
        setError(error.response.data?.message || "Failed to register admin");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#003049] to-[#d62828] p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiShield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Administrator Registration</h2>
          <p className="text-white/80 text-center">Join the CampusCare administrative team</p>
        </div>

        <div className="p-8">
          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Alert type="error" className="border-[#d62828] bg-red-50">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Alert type="success" className="border-green-500 bg-green-50">
                  <div className="flex items-center">
                    <FiCheck className="w-5 h-5 mr-2" />
                    Admin account created successfully! Redirecting to login...
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-[#003049]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  register={register}
                  errors={errors}
                  icon={FiUser}
                />

                <FormField
                  name="staffId"
                  label="Staff ID"
                  placeholder="Enter your staff ID"
                  required
                  register={register}
                  errors={errors}
                  icon={FiShield}
                />

                <FormField
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  register={register}
                  errors={errors}
                  icon={FiMail}
                />

                <FormField
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  required
                  register={register}
                  errors={errors}
                  icon={FiPhone}
                />

                <FormField
                  type="select"
                  name="gender"
                  label="Gender"
                  required
                  register={register}
                  errors={errors}
                  icon={FiUser}
                  options={[
                    { value: "", label: "-- Select gender --" },
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />

                                 <FormField
                   name="department"
                   label="Department"
                   placeholder="E.g., Mental Health, Career Guidance"
                   required
                   register={register}
                   errors={errors}
                   icon={FiHome}
                 />
              </div>
            </motion.div>

            {/* Security Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiLock className="w-5 h-5 mr-2 text-[#003049]" />
                Security & Access
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  register={register}
                  errors={errors}
                  icon={FiLock}
                  showPasswordToggle={true}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                <FormField
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  required
                  register={register}
                  errors={errors}
                  icon={FiLock}
                  showPasswordToggle={true}
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>

              <div className="mt-6">
                <FormField
                  name="adminCode"
                  label="Admin Registration Code"
                  placeholder="Enter the administrator registration code"
                  required
                  register={register}
                  errors={errors}
                  icon={FiKey}
                  helperText="This special code is required to create an admin account. Contact your system administrator if you don't have it."
                />
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={loading}
                className="flex-1 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                Reset Form
              </Button>
              
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-[#003049] to-[#d62828] hover:from-[#d62828] hover:to-[#f77f00] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <FiShield className="w-5 h-5 mr-2" />
                )}
                {loading ? "Creating Account..." : "Register as Admin"}
                {!loading && <FiArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#003049] hover:text-[#d62828] transition-colors duration-300 flex items-center justify-center inline-flex"
              >
                Sign in here
                <FiArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterAdminForm;

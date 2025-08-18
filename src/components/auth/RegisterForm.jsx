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
  FiCalendar,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiUserPlus,
  FiHome,
  FiBookOpen,
  FiUsers,
  FiHeart,
  FiShield,
} from "react-icons/fi";
import { Button, SuccessModal } from "../ui";
import { FormContainer, FormGroup, FormActions, FormField } from "../forms";
import { useAuth } from "../../contexts/AuthContext";

// Programs of study options
const PROGRAMS = [
  "BUSINESS/ ECONOMICS",
  "CATERING/ FASHION/ TECHNOLOGY",
  "COMPUTER SCIENCE",
  "CYBER SECURITY",
  "SCIENCES",
  "MATHEMATICS",
  "HUMANITIES",
  "Other",
];

// Academic levels
const LEVELS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "Postgraduate",
  "Diploma",
];

// Residential status options
const RESIDENTIAL_STATUS = [
  "On-campus",
  "Off-campus",
  "University Hostel",
  "Private Hostel",
  "With Family",
];

// Gender options
const GENDER = ["Male", "Female", "Other", "Prefer not to say"];

// Form validation schema
const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  studentId: yup.string().required("Student ID is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  dateOfBirth: yup.string().nullable(),
  programOfStudy: yup.string().required("Program of study is required"),
  customProgram: yup.string().when("programOfStudy", {
    is: "Other",
    then: (schema) => schema.required("Please specify your program of study"),
    otherwise: (schema) => schema.notRequired(),
  }),
  level: yup.string().required("Academic level is required"),
  residentialStatus: yup.string().required("Residential status is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  consentToTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const totalSteps = 2;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      studentId: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
      programOfStudy: "",
      customProgram: "",
      level: "",
      residentialStatus: "",
      password: "",
      confirmPassword: "",
      consentToTerms: false,
    },
  });

  // Watch to check if current step fields are valid
  const watchedFields = watch();

  const validateStep = async () => {
    let fieldsToValidate = [];

    if (step === 1) {
      fieldsToValidate = [
        "fullName",
        "studentId",
        "email",
        "phoneNumber",
        "gender",
        "dateOfBirth",
        "programOfStudy",
        "customProgram",
        "level",
        "residentialStatus",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["password", "confirmPassword", "consentToTerms"];
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isStepValid = await validateStep();
    if (isStepValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiError("");

      // Remove confirmPassword from data before sending to API
      const {
        confirmPassword,
        programOfStudy,
        customProgram,
        residentialStatus,
        ...registrationData
      } = data;

      // Map residential status to match backend enum values
      let mappedResidentialStatus = "Other";
      if (residentialStatus === "On-campus") {
        mappedResidentialStatus = "On-Campus";
      } else if (residentialStatus === "Off-campus") {
        mappedResidentialStatus = "Off-Campus";
      } else if (
        residentialStatus === "University Hostel" ||
        residentialStatus === "Private Hostel"
      ) {
        mappedResidentialStatus = "Hostel";
      }

      // Use custom program if 'Other' is selected, otherwise use selected program
      const finalProgramOfStudy = programOfStudy === "Other" ? customProgram : programOfStudy;

      // Map form fields to match the backend API expectations
      const mappedData = {
        ...registrationData,
        programmeOfStudy: finalProgramOfStudy, // Fix spelling to match backend
        residentialStatus: mappedResidentialStatus, // Use mapped value
        reasonForCounseling: ["General"], // Provide a default reason
        emergencyContact: {
          name: "",
          relationship: "",
          phoneNumber: "",
        },
        previousCounselingHistory: {
          hasPreviousCounseling: false,
          details: "",
        },
        consentGiven: registrationData.consentToTerms,
        role: "student",
      };

      // Remove any fields not in the proper format
      delete mappedData.consentToTerms;

      // Call registration function from auth context
      const response = await registerStudent(mappedData);

      if (response.status === "success") {
        setShowSuccessModal(true);
      } else {
        setApiError(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setApiError(error.message || "An error occurred during registration");
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

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003049] via-[#d62828] to-[#f77f00] flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#fcbf49] to-[#f77f00] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <FiUserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join Our Community!
          </h1>
          <p className="text-blue-100">
            Create your account and start your counseling journey
          </p>
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

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center flex-1"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: step >= index + 1 ? 1 : 0.8,
                    opacity: step >= index + 1 ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-300 ${
                      step > index + 1
                        ? "bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white shadow-lg"
                        : step === index + 1
                        ? "bg-gradient-to-r from-[#003049] to-[#d62828] text-white shadow-lg"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > index + 1 ? (
                      <FiCheck className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      step >= index + 1 ? "text-[#003049]" : "text-gray-500"
                    }`}
                  >
                    {index === 0 ? "Personal Info" : "Account Setup"}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                  className="h-2 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-[#003049] flex items-center justify-center">
                      <FiUser className="mr-2" />
                      Personal Information
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Tell us about yourself
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-[#003049]" />
                        </div>
                        <input
                          {...register("fullName")}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Student ID *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiBookOpen className="h-5 w-5 text-[#003049]" />
                        </div>
                        <input
                          {...register("studentId")}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                          placeholder="Enter your student ID"
                        />
                      </div>
                      {errors.studentId && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.studentId.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-[#003049]" />
                        </div>
                        <input
                          type="email"
                          {...register("email")}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-5 w-5 text-[#003049]" />
                        </div>
                        <input
                          {...register("phoneNumber")}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        {...register("gender")}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                      >
                        <option value="">Select gender</option>
                        {GENDER.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                      {errors.gender && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-[#003049]" />
                        </div>
                        <input
                          type="date"
                          {...register("dateOfBirth")}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Program of Study */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Program of Study *
                      </label>
                      <select
                        {...register("programOfStudy")}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                      >
                        <option value="">Select program</option>
                        {PROGRAMS.map((program) => (
                          <option key={program} value={program}>
                            {program}
                          </option>
                        ))}
                      </select>
                      {errors.programOfStudy && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.programOfStudy.message}
                        </p>
                      )}
                    </div>

                    {/* Custom Program Field - Show when Other is selected */}
                    {watchedFields.programOfStudy === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Specify Your Program *
                        </label>
                        <input
                          {...register("customProgram")}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                          placeholder="Enter your program of study"
                        />
                        {errors.customProgram && (
                          <p className="mt-2 text-sm text-[#d62828] flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.customProgram.message}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Academic Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Academic Level *
                      </label>
                      <select
                        {...register("level")}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                      >
                        <option value="">Select level</option>
                        {LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {errors.level && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.level.message}
                        </p>
                      )}
                    </div>

                    {/* Residential Status */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <FiHome className="inline mr-2 text-[#003049]" />
                        Residential Status *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {RESIDENTIAL_STATUS.map((status) => {
                          const isSelected = watchedFields.residentialStatus === status;
                          return (
                            <motion.label
                              key={status}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="relative cursor-pointer"
                            >
                              <input
                                type="radio"
                                value={status}
                                {...register("residentialStatus")}
                                className="sr-only"
                              />
                              <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group h-20 ${
                                isSelected
                                  ? "border-[#f77f00] bg-gradient-to-br from-[#f77f00]/10 to-[#fcbf49]/10 shadow-md"
                                  : "border-gray-200 hover:border-[#f77f00]"
                              }`}>
                                <FiHome className={`h-5 w-5 mb-1 transition-colors duration-200 ${
                                  isSelected ? "text-[#f77f00]" : "text-[#003049] group-hover:text-[#f77f00]"
                                }`} />
                                <span className={`text-xs font-medium text-center transition-colors duration-200 ${
                                  isSelected ? "text-[#f77f00] font-semibold" : "text-gray-700 group-hover:text-[#003049]"
                                }`}>
                                  {status}
                                </span>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center shadow-lg"
                                >
                                  <FiCheck className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </motion.label>
                          );
                        })}
                      </div>
                      {errors.residentialStatus && (
                        <p className="mt-2 text-sm text-[#d62828] flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.residentialStatus.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                    >
                      Next Step
                      <FiArrowRight className="ml-2 h-5 w-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-[#003049] flex items-center justify-center">
                      <FiShield className="mr-2" />
                      Account Security
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Secure your account with a strong password
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-[#003049]" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                        placeholder="Create a strong password"
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
                    <p className="mt-1 text-sm text-gray-500">
                      Must be at least 8 characters long
                    </p>
                    {errors.password && (
                      <p className="mt-2 text-sm text-[#d62828] flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-[#003049]" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f77f00] focus:border-[#f77f00] transition-all duration-200"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        {...register("consentToTerms")}
                        className="w-5 h-5 text-[#f77f00] bg-gray-100 border-gray-300 rounded focus:ring-[#f77f00] focus:ring-2 mt-1 flex-shrink-0"
                      />
                      <div className="ml-3">
                        <label className="font-medium text-gray-700 text-sm">
                          <FiHeart className="inline mr-2 text-[#d62828]" />I
                          accept the terms and conditions
                        </label>
                        <p className="mt-2 text-sm text-gray-600">
                          By creating an account, you agree to our{" "}
                          <Link
                            to="/terms"
                            className="text-[#f77f00] hover:text-[#d62828] font-medium"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-[#f77f00] hover:text-[#d62828] font-medium"
                          >
                            Privacy Policy
                          </Link>
                          . Your information will be kept secure and
                          confidential.
                        </p>
                      </div>
                    </div>
                    {errors.consentToTerms && (
                      <p className="mt-3 text-sm text-[#d62828] flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.consentToTerms.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold shadow hover:shadow-md transition-all duration-300 flex items-center"
                    >
                      <FiArrowLeft className="mr-2 h-5 w-5" />
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-[#003049] to-[#d62828] text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FiUserPlus className="mr-2 h-5 w-5" />
                          Create Account
                        </div>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center border-t border-gray-200 pt-6"
          >
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#003049] hover:text-[#f77f00] font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom decorative elements */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#fcbf49] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Account Created Successfully!"
        message="Welcome to our counseling platform! Your student account has been created and you can now access all our services. Please proceed to login with your credentials."
        buttonText="Go to Login"
        onButtonClick={() => {
          setShowSuccessModal(false);
          navigate("/login", {
            state: { message: "Registration successful! You can now login." },
          });
        }}
      />
    </div>
  );
};

export default RegisterForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format, parse } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, Alert } from "../../components/ui";
import {
  FormContainer,
  FormGroup,
  FormActions,
  FormField,
} from "../../components/forms";
import AppointmentService from "../../services/appointment.service";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiVideo,
  FiPhone,
  FiHeart,
  FiStar,
  FiZap,
  FiTarget,
  FiCheck,
} from "react-icons/fi";

// Form validation schema
const schema = yup.object({
  counselorId: yup.string().required("Please select a counselor"),
  title: yup.string().required("Title is required"),
  appointmentDate: yup.string().required("Date is required"),
  timeSlotId: yup.string().required("Please select a time slot"),
  duration: yup
    .number()
    .required("Duration is required")
    .min(15, "Minimum duration is 15 minutes")
    .max(120, "Maximum duration is 120 minutes"),
  type: yup.string().required("Appointment type is required"),
  reason: yup.string().required("Reason for appointment is required"),
  location: yup.string().when("type", {
    is: "In-Person",
    then: () => yup.string().required("Location is required"),
    otherwise: () => yup.string(),
  }),
  zoomLink: yup.string().when("type", {
    is: "Zoom",
    then: () => yup.string().required("Zoom link is required"),
    otherwise: () => yup.string(),
  }),
  description: yup.string(),
});

const RequestAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeLoading, setTimeLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "Counseling Session",
      duration: 30,
      type: "In-Person",
    },
  });

  // Define watched values immediately after useForm
  const appointmentType = watch("type");
  const selectedCounselorId = watch("counselorId");
  const selectedDate = watch("appointmentDate");

  // Debug to check errors in form
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  // Log appointment type changes
  useEffect(() => {
    console.log("Appointment type in state:", appointmentType);
  }, [appointmentType]);

  // Add console logs when these values change
  useEffect(() => {
    console.log("Counselor ID changed:", selectedCounselorId);
  }, [selectedCounselorId]);

  useEffect(() => {
    console.log("Date changed:", selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      fetchCounselors();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Add debug logs to track state
  useEffect(() => {
    console.log("Current state:", {
      selectedCounselorId,
      selectedDate,
      timeSlots,
      timeLoading,
      appointmentType,
    });
  }, [
    selectedCounselorId,
    selectedDate,
    timeSlots,
    timeLoading,
    appointmentType,
  ]);

  // Load available time slots when counselor and date are selected
  useEffect(() => {
    console.log("Effect triggered:", { selectedCounselorId, selectedDate });
    if (selectedCounselorId && selectedDate) {
      console.log("Both values present, fetching time slots...");
      fetchTimeSlots(selectedCounselorId, selectedDate);
    } else {
      console.log("Missing values, clearing time slots");
      setTimeSlots([]);
    }
  }, [selectedCounselorId, selectedDate]);

  const fetchCounselors = async () => {
    try {
      setError("");
      console.log("Fetching counselors...");

      const response = await AppointmentService.getAvailableCounselors();
      console.log("Counselors response:", response);

      if (response.data && response.data.status === "success") {
        setCounselors(response.data.data.counselors || []);
        console.log("Counselors set:", response.data.data.counselors);
      } else {
        console.error("Failed to load counselors:", response.data?.message);
        setError(
          response.data?.message || "Failed to load available counselors"
        );
      }
    } catch (error) {
      console.error("Error fetching counselors:", error);
      setError("An error occurred while loading counselors");
    }
  };

  const fetchTimeSlots = async (counselorId, date) => {
    try {
      console.log(
        `Fetching time slots for counselor ${counselorId} on ${date}`
      );
      setTimeLoading(true);
      setError("");

      const response = await AppointmentService.getCounselorTimeSlots(
        counselorId,
        date
      );
      console.log("Time slots response:", response);

      if (response.data && response.data.status === "success") {
        const slots = response.data.data.timeSlots || [];
        console.log("Time slots received:", slots);

        // The backend now returns the correct structure, so we can use it directly
        const mappedSlots = slots.map((slot) => ({
          id: slot.id,
          time: slot.time,
          displayTime: new Date(slot.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          available: slot.available,
        }));

        console.log("Mapped time slots:", mappedSlots);
        setTimeSlots(mappedSlots);
      } else {
        console.error("Failed to load time slots:", response.data?.message);
        setError(
          response.data?.message || "Failed to load available time slots"
        );
        setTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setError("An error occurred while loading available time slots");
      setTimeSlots([]);
    } finally {
      setTimeLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      // Find the selected time slot by ID
      const selectedTimeSlot = timeSlots.find(
        (slot) => slot.id === data.timeSlotId
      );

      if (!selectedTimeSlot) {
        throw new Error("Invalid time slot selected");
      }

      // Use the ISO string directly from the time slot
      const appointmentDateTime = selectedTimeSlot.time;

      // Prepare appointment data
      const appointmentData = {
        counselorId: data.counselorId,
        title: data.title,
        description: data.description,
        appointmentDate: appointmentDateTime,
        duration: data.duration,
        type: data.type,
        reason: data.reason,
        location: data.type === "In-Person" ? data.location : "",
        zoomLink: data.type === "Zoom" ? data.zoomLink : "",
        notes: data.description,
      };

      console.log("Submitting appointment request:", appointmentData);

      const response = await AppointmentService.createAppointment(
        appointmentData
      );
      console.log("Appointment response:", response);

      if (response.data && response.data.status === "success") {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/appointments");
        }, 2000);
      } else {
        setError(response.data?.message || "Failed to request appointment");
      }
    } catch (error) {
      console.error("Error requesting appointment:", error);
      setError(
        error.message || "An error occurred while requesting the appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get appointment type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case "In-Person":
        return <FiUser className="w-5 h-5 text-[#003049]" />;
      case "Zoom":
        return <FiVideo className="w-5 h-5 text-[#d62828]" />;
      case "Phone":
        return <FiPhone className="w-5 h-5 text-[#f77f00]" />;
      default:
        return <FiCalendar className="w-5 h-5 text-[#fcbf49]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative"
    >
      {/* Background decorative elements */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-gradient-to-br from-[#fcbf49]/5 to-[#f77f00]/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-[#d62828]/5 to-[#003049]/5 rounded-full blur-2xl"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center bg-gradient-to-r from-[#003049] to-[#d62828] rounded-2xl p-8 text-white relative overflow-hidden"
      >
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-4 right-8 w-3 h-3 bg-[#fcbf49] rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-6 right-16 w-2 h-2 bg-[#f77f00] rounded-full opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
        />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-6 text-white hover:text-[#fcbf49] bg-white/10 hover:bg-white/20 border-white/20 p-3 rounded-xl"
            aria-label="Back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Button>
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold flex items-center"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#fcbf49] to-[#f77f00] rounded-full flex items-center justify-center mr-4">
              <FiCalendar className="w-5 h-5 text-white" />
            </div>
            Request an Appointment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 mt-2 flex items-center"
          >
            <FiHeart className="mr-2 w-4 h-4 text-[#f77f00]" />
            Schedule a counseling session with our professional counselors
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative"
      >
        {/* Decorative elements inside card */}
        <div className="absolute top-4 right-8 w-4 h-4 bg-[#fcbf49] rounded-full opacity-10"></div>
        <div className="absolute bottom-8 left-8 w-3 h-3 bg-[#f77f00] rounded-full opacity-15"></div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-8"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto h-24 w-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mb-8"
            >
              <FiCheck className="h-12 w-12 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-[#003049] mb-4">
              Appointment Requested Successfully! 🎉
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Your appointment request has been submitted. You'll receive a
              confirmation soon via email and SMS.
            </p>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/appointments")}
              >
                <FiCalendar className="mr-2 w-5 h-5" />
                View My Appointments
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="p-8">
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-8"
                >
                  <Alert
                    type="error"
                    title="Error"
                    className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 rounded-xl"
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-[#003049] mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mr-3">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Counselor <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("counselorId", { required: true })}
                      className={`w-full py-3 px-4 border-2 ${
                        errors.counselorId
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-[#f77f00]"
                      } rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300`}
                    >
                      <option value="">-- Select a counselor --</option>
                      {counselors.map((counselor) => (
                        <option key={counselor._id} value={counselor._id}>
                          {counselor.fullName} -{" "}
                          {counselor.department || "Counselor"}
                        </option>
                      ))}
                    </select>
                    {errors.counselorId && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.counselorId.message ||
                          "Please select a counselor"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Appointment Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("title", { required: true })}
                      className={`w-full py-3 px-4 border-2 ${
                        errors.title
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-[#f77f00]"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300`}
                      placeholder="e.g., Initial Counseling Session"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.title.message || "Title is required"}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Date & Time Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-[#003049] mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#d62828] to-[#f77f00] rounded-full flex items-center justify-center mr-3">
                    <FiClock className="w-4 h-4 text-white" />
                  </div>
                  Date & Time
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("appointmentDate", { required: true })}
                      className={`w-full py-3 px-4 border-2 ${
                        errors.appointmentDate
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-[#f77f00]"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300`}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        setValue("appointmentDate", e.target.value);
                        console.log("Date input changed:", e.target.value);
                      }}
                    />
                    {errors.appointmentDate && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.appointmentDate.message || "Date is required"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("duration", { required: true })}
                      className={`w-full py-3 px-4 border-2 ${
                        errors.duration
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-[#f77f00]"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300`}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                    </select>
                    {errors.duration && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.duration.message || "Duration is required"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Available Time Slots <span className="text-red-500">*</span>
                  </label>

                  {timeLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center py-8 bg-gray-50 rounded-xl"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-8 h-8 border-4 border-[#f77f00] border-t-transparent rounded-full"
                      />
                      <span className="ml-3 text-gray-600">
                        Loading time slots...
                      </span>
                    </motion.div>
                  ) : !selectedCounselorId || !selectedDate ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        Please select a counselor and date first
                      </p>
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-center py-8 bg-red-50 rounded-xl border-2 border-red-200">
                      <FiClock className="mx-auto h-12 w-12 text-red-400 mb-4" />
                      <p className="text-red-600">
                        No available time slots for the selected date
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <motion.div
                          key={slot.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative"
                        >
                          <input
                            type="radio"
                            id={slot.id}
                            value={slot.id}
                            {...register("timeSlotId", {
                              required: "Please select a time slot",
                            })}
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={slot.id}
                            className="flex items-center justify-center p-3 text-sm border-2 rounded-xl cursor-pointer transition-all duration-300
                              peer-checked:bg-gradient-to-r peer-checked:from-[#f77f00] peer-checked:to-[#fcbf49] peer-checked:border-[#f77f00] peer-checked:text-white peer-checked:shadow-lg
                              hover:bg-gray-50 hover:border-[#f77f00]/50 border-gray-200 bg-white font-semibold"
                          >
                            <FiClock className="mr-2 h-4 w-4" />
                            {slot.displayTime}
                          </label>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {errors.timeSlotId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.timeSlotId.message || "Please select a time slot"}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Appointment Type Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-[#003049] mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#003049] to-[#d62828] rounded-full flex items-center justify-center mr-3">
                    <FiTarget className="w-4 h-4 text-white" />
                  </div>
                  Appointment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Appointment Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          value: "In-Person",
                          label: "In-Person Meeting",
                          icon: FiUser,
                        },
                        {
                          value: "Zoom",
                          label: "Virtual (Zoom)",
                          icon: FiVideo,
                        },
                        { value: "Phone", label: "Phone Call", icon: FiPhone },
                      ].map((type) => (
                        <motion.div
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            id={type.value}
                            value={type.value}
                            {...register("type", { required: true })}
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={type.value}
                            className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300
                              peer-checked:bg-gradient-to-r peer-checked:from-[#f77f00]/10 peer-checked:to-[#fcbf49]/10 peer-checked:border-[#f77f00] peer-checked:shadow-lg
                              hover:bg-gray-50 hover:border-gray-300 border-gray-200 bg-white"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mr-4">
                              <type.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-[#003049]">
                                {type.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                {type.value === "In-Person" &&
                                  "Meet at our counseling center"}
                                {type.value === "Zoom" &&
                                  "Join via video conference"}
                                {type.value === "Phone" &&
                                  "Connect via phone call"}
                              </div>
                            </div>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                    {errors.type && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.type.message || "Appointment type is required"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reason for Appointment{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("reason", { required: true })}
                        className={`w-full py-3 px-4 border-2 ${
                          errors.reason
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-[#f77f00]"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300`}
                      >
                        <option value="">-- Select a reason --</option>
                        <option value="Academic">Academic Support</option>
                        <option value="Personal">Personal Issues</option>
                        <option value="Emotional">Emotional Support</option>
                        <option value="Career">Career Guidance</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.reason && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.reason.message || "Reason is required"}
                        </p>
                      )}
                    </div>

                    {/* Conditional fields based on appointment type */}
                    <AnimatePresence>
                      {appointmentType === "In-Person" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Preferred Location{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("location", {
                              required: appointmentType === "In-Person",
                            })}
                            className={`w-full py-3 px-4 border-2 ${
                              errors.location
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 focus:border-[#f77f00]"
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300`}
                            placeholder="e.g., Counseling Center - Room 101"
                          />
                          {errors.location && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.location.message ||
                                "Location is required"}
                            </p>
                          )}
                        </motion.div>
                      )}

                      {appointmentType === "Zoom" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Zoom Link <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            {...register("zoomLink", {
                              required: appointmentType === "Zoom",
                            })}
                            className={`w-full py-3 px-4 border-2 ${
                              errors.zoomLink
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 focus:border-[#f77f00]"
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300`}
                            placeholder="https://zoom.us/j/..."
                          />
                          {errors.zoomLink && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.zoomLink.message ||
                                "Zoom link is required"}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full py-3 px-4 border-2 border-gray-200 focus:border-[#f77f00] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f77f00]/20 transition-all duration-300"
                    placeholder="Please provide any additional information about your appointment request..."
                    rows={4}
                  ></textarea>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end space-x-4 pt-6 border-t border-gray-200"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 flex items-center"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiZap className="mr-2 w-5 h-5" />
                        Request Appointment
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RequestAppointment;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiVideo,
  FiPhone,
  FiCheck,
  FiX,
  FiPlus,
  FiStar,
  FiHeart,
  FiZap,
  FiTarget,
  FiActivity,
} from "react-icons/fi";
import { Card, Button, Badge, Tabs, Alert } from "../../components/ui";
import AppointmentService from "../../services/appointment.service";

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState({
    upcoming: [],
    past: [],
    cancelled: [],
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await AppointmentService.getStudentAppointments();
      console.log("Appointments response:", response);

      if (response.data && response.data.status === "success") {
        // Categorize appointments
        const now = new Date();
        const all = response.data.data.appointments || [];

        setAppointments({
          upcoming: all
            .filter(
              (apt) =>
                new Date(apt.appointmentDate) > now &&
                apt.status !== "Cancelled"
            )
            .sort(
              (a, b) =>
                new Date(a.appointmentDate) - new Date(b.appointmentDate)
            ),

          past: all
            .filter(
              (apt) =>
                new Date(apt.appointmentDate) < now &&
                apt.status !== "Cancelled"
            )
            .sort(
              (a, b) =>
                new Date(b.appointmentDate) - new Date(a.appointmentDate)
            ),

          cancelled: all
            .filter((apt) => apt.status === "Cancelled")
            .sort(
              (a, b) =>
                new Date(b.appointmentDate) - new Date(a.appointmentDate)
            ),
        });
      } else {
        setError(response.data?.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("An error occurred while loading your appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await AppointmentService.cancelAppointment(
        appointmentId
      );

      if (response.data && response.data.status === "success") {
        // Refresh appointments list
        fetchAppointments();
      } else {
        setError(response.data?.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setError("An error occurred while cancelling the appointment");
    } finally {
      setLoading(false);
    }
  };

  // Format date and time
  const formatDate = (dateString) => {
    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Date unavailable";
    }
  };

  const formatTime = (dateString) => {
    try {
      const options = { hour: "numeric", minute: "2-digit" };
      return new Date(dateString).toLocaleTimeString(undefined, options);
    } catch (error) {
      console.error("Error formatting time:", error, dateString);
      return "Time unavailable";
    }
  };

  // Get appointment type icon
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "in-person":
        return <FiUser className="text-[#003049]" />;
      case "video":
      case "zoom":
        return <FiVideo className="text-[#d62828]" />;
      case "phone":
        return <FiPhone className="text-[#f77f00]" />;
      default:
        return <FiCalendar className="text-[#fcbf49]" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
          >
            <FiCheck className="w-3 h-3 mr-1" />
            Scheduled
          </motion.div>
        );
      case "completed":
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#003049] to-[#d62828] text-white"
          >
            <FiCheck className="w-3 h-3 mr-1" />
            Completed
          </motion.div>
        );
      case "cancelled":
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
          >
            <FiX className="w-3 h-3 mr-1" />
            Cancelled
          </motion.div>
        );
      case "rescheduled":
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#fcbf49] to-[#f77f00] text-white"
          >
            <FiClock className="w-3 h-3 mr-1" />
            Rescheduled
          </motion.div>
        );
      default:
        return (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
          >
            {status}
          </motion.div>
        );
    }
  };

  // Render a single appointment card
  const renderAppointmentCard = (appointment, canCancel = false) => (
    <motion.div
      key={appointment._id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#f77f00] mb-4 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-2 right-4 w-3 h-3 bg-[#fcbf49] rounded-full opacity-20"></div>
      <div className="absolute bottom-4 right-2 w-2 h-2 bg-[#f77f00] rounded-full opacity-30"></div>

      <div className="border-l-4 border-gradient-to-b from-[#f77f00] to-[#fcbf49] pl-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-[#003049] text-xl mb-3 flex items-center"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mr-3">
                <FiCalendar className="w-4 h-4 text-white" />
              </div>
              {appointment.title}
            </motion.h3>

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center text-gray-700 text-sm bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200"
              >
                <FiCalendar className="mr-3 text-[#f77f00] w-4 h-4" />
                <div>
                  <span className="font-semibold">
                    {formatDate(appointment.appointmentDate)}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center text-gray-700 text-sm bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200"
              >
                <FiClock className="mr-3 text-[#d62828] w-4 h-4" />
                <div>
                  <span className="font-semibold">
                    {formatTime(appointment.appointmentDate)}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({appointment.duration} minutes)
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center text-gray-700 text-sm bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200"
              >
                <FiMapPin className="mr-3 text-[#003049] w-4 h-4" />
                <span className="font-medium">
                  {appointment.location || appointment.type}
                </span>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-3 ml-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center bg-gradient-to-r from-[#fcbf49]/10 to-[#f77f00]/10 rounded-full px-4 py-2 border border-[#f77f00]/20"
            >
              {getTypeIcon(appointment.type)}
              <span className="text-sm font-semibold ml-2 text-[#003049]">
                {appointment.type || "Meeting"}
              </span>
            </motion.div>

            {getStatusBadge(appointment.status)}

            {canCancel && appointment.status?.toLowerCase() === "scheduled" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCancelAppointment(appointment._id)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                <FiX className="w-4 h-4 mr-1" />
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderEmpty = (message) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-8 left-8 w-4 h-4 bg-[#fcbf49] rounded-full opacity-20"></div>
      <div className="absolute bottom-12 right-12 w-6 h-6 bg-[#f77f00] rounded-full opacity-15"></div>
      <div className="absolute top-1/2 right-8 w-3 h-3 bg-[#d62828] rounded-full opacity-25"></div>

      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mx-auto h-20 w-20 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mb-6"
      >
        <FiCalendar className="h-10 w-10 text-white" />
      </motion.div>

      <h3 className="text-xl font-bold text-[#003049] mb-2">
        No appointments found
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      <Link to="/request-appointment">
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FiPlus className="mr-2 w-5 h-5" />
            Schedule Appointment
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative"
    >
      {/* Background decorative elements */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-gradient-to-br from-[#fcbf49]/5 to-[#f77f00]/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-[#d62828]/5 to-[#003049]/5 rounded-full blur-2xl"></div>

      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-gradient-to-r from-[#003049] to-[#d62828] rounded-2xl p-8 text-white relative overflow-hidden"
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

        <div>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold flex items-center"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#fcbf49] to-[#f77f00] rounded-full flex items-center justify-center mr-4">
              <FiCalendar className="w-5 h-5 text-white" />
            </div>
            My Appointments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 mt-2 flex items-center"
          >
            <FiHeart className="mr-2 w-4 h-4 text-[#f77f00]" />
            Manage your counseling sessions and appointments
          </motion.p>
        </div>

        <Link to="/request-appointment">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              className="bg-gradient-to-r from-[#fcbf49] to-[#f77f00] hover:from-[#f77f00] hover:to-[#fcbf49] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <FiPlus className="mr-2 w-5 h-5" />
              Schedule Appointment
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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

      {/* Loading State */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Enhanced Tabs */}
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-100 mb-8">
            <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-xl">
              {[
                {
                  id: "upcoming",
                  label: `Upcoming (${appointments.upcoming.length})`,
                  icon: FiTarget,
                  color: "from-[#f77f00] to-[#fcbf49]",
                },
                {
                  id: "past",
                  label: `Past (${appointments.past.length})`,
                  icon: FiActivity,
                  color: "from-[#003049] to-[#d62828]",
                },
                {
                  id: "cancelled",
                  label: `Cancelled (${appointments.cancelled.length})`,
                  icon: FiX,
                  color: "from-gray-500 to-gray-600",
                },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "upcoming" && (
                <div>
                  {appointments.upcoming.length > 0
                    ? appointments.upcoming.map((appointment) =>
                        renderAppointmentCard(appointment, true)
                      )
                    : renderEmpty("You don't have any upcoming appointments")}
                </div>
              )}

              {activeTab === "past" && (
                <div>
                  {appointments.past.length > 0
                    ? appointments.past.map((appointment) =>
                        renderAppointmentCard(appointment)
                      )
                    : renderEmpty("You don't have any past appointments")}
                </div>
              )}

              {activeTab === "cancelled" && (
                <div>
                  {appointments.cancelled.length > 0
                    ? appointments.cancelled.map((appointment) =>
                        renderAppointmentCard(appointment)
                      )
                    : renderEmpty("You don't have any cancelled appointments")}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Appointments;

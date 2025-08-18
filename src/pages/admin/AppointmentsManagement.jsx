import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiFilter,
  FiUser,
  FiVideo,
  FiPhone,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiSearch,
  FiMapPin,
  FiMail,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { Card, Button, Badge, Tabs, Alert, Spinner } from "../../components/ui";
import AppointmentService from "../../services/appointment.service";

const AppointmentsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState({});
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchAppointments();
  }, [filterDate, filterStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await AppointmentService.getCounselorAppointments(
        1,
        50,
        filterStatus,
        filterDate
      );

      if (response.data && response.data.status === "success") {
        // Categorize appointments
        const now = new Date();
        const all = response.data.data.appointments || [];

        const categorizedAppointments = {
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
        };

        setAppointments(categorizedAppointments);

        // Calculate stats
        setStats({
          total: all.length,
          upcoming: categorizedAppointments.upcoming.length,
          completed: categorizedAppointments.past.filter(apt => apt.status === "Completed").length,
          cancelled: categorizedAppointments.cancelled.length,
        });
      } else {
        setError(response.data?.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("An error occurred while loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await AppointmentService.updateAppointment(
        appointmentId,
        { status: newStatus }
      );

      if (response.data && response.data.status === "success") {
        // Refresh appointments list
        fetchAppointments();
      } else {
        setError(
          response.data?.message || "Failed to update appointment status"
        );
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError("An error occurred while updating the appointment");
    }
  };

  // Format date and time
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Get appointment type icon and color
  const getTypeDetails = (type) => {
    switch (type?.toLowerCase()) {
      case "in-person":
        return { 
          icon: <FiUser className="w-4 h-4" />, 
          color: "from-[#003049] to-[#0056b3]",
          bgColor: "bg-[#003049]/10"
        };
      case "zoom":
        return { 
          icon: <FiVideo className="w-4 h-4" />, 
          color: "from-[#f77f00] to-[#fcbf49]",
          bgColor: "bg-[#f77f00]/10"
        };
      case "phone":
        return { 
          icon: <FiPhone className="w-4 h-4" />, 
          color: "from-[#d62828] to-[#f77f00]",
          bgColor: "bg-[#d62828]/10"
        };
      default:
        return { 
          icon: <FiCalendar className="w-4 h-4" />, 
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-100"
        };
    }
  };

  // Get status badge with brand colors
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return (
          <div className="flex items-center px-2 py-1 bg-[#f77f00]/10 text-[#f77f00] rounded-full text-xs font-medium">
            <FiClock className="w-3 h-3 mr-1" />
            Scheduled
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <FiCheckCircle className="w-3 h-3 mr-1" />
            Completed
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center px-2 py-1 bg-[#d62828]/10 text-[#d62828] rounded-full text-xs font-medium">
            <FiXCircle className="w-3 h-3 mr-1" />
            Cancelled
          </div>
        );
      case "rescheduled":
        return (
          <div className="flex items-center px-2 py-1 bg-[#fcbf49]/20 text-[#f77f00] rounded-full text-xs font-medium">
            <FiRefreshCw className="w-3 h-3 mr-1" />
            Rescheduled
          </div>
        );
      default:
        return (
          <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            {status}
          </div>
        );
    }
  };

  // Filter appointments based on search term
  const filterAppointments = (appointmentsList) => {
    if (!searchTerm) return appointmentsList;
    
    return appointmentsList.filter(appointment =>
      appointment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Render stats cards
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#003049] to-[#0056b3] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Appointments</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiCalendar className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-[#f77f00] to-[#fcbf49] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Upcoming</p>
            <p className="text-2xl font-bold">{stats.upcoming}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-[#d62828] to-[#f77f00] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Cancelled</p>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiXCircle className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Render a single appointment card
  const renderAppointmentCard = (appointment, index) => {
    const typeDetails = getTypeDetails(appointment.type);
    
    return (
      <motion.div
        key={appointment._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        <div className={`h-1 bg-gradient-to-r ${typeDetails.color}`} />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-lg ${typeDetails.bgColor} flex items-center justify-center mr-3`}>
                  <div className={`text-transparent bg-gradient-to-r ${typeDetails.color} bg-clip-text`}>
                    {typeDetails.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {appointment.title}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {appointment.type || "Meeting"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <FiCalendar className="w-4 h-4 mr-2 text-[#003049]" />
                {formatDate(appointment.appointmentDate)}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <FiClock className="w-4 h-4 mr-2 text-[#f77f00]" />
                {formatTime(appointment.appointmentDate)} ({appointment.duration} min)
              </div>
            </div>
            
            <div className="space-y-2">
              {appointment.location && (
                <div className="flex items-center text-gray-600 text-sm">
                  <FiMapPin className="w-4 h-4 mr-2 text-[#d62828]" />
                  {appointment.location}
                </div>
              )}
              {appointment.zoomLink && (
                <div className="flex items-center text-gray-600 text-sm">
                  <FiVideo className="w-4 h-4 mr-2 text-[#f77f00]" />
                  <a
                    href={appointment.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#003049] hover:text-[#d62828] transition-colors"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Reason:</span> {appointment.reason}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#003049] to-[#0056b3] rounded-full flex items-center justify-center mr-3">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {appointment.student?.fullName || "Student"}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <FiMail className="w-3 h-3 mr-1" />
                  {appointment.student?.email || ""}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {appointment.status !== "Completed" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  onClick={() => handleUpdateStatus(appointment._id, "Completed")}
                >
                  <FiCheck className="w-4 h-4 mr-1" />
                  Complete
                </motion.button>
              )}

              {appointment.status !== "Cancelled" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  onClick={() => handleUpdateStatus(appointment._id, "Cancelled")}
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
  };

  // Render empty state
  const renderEmptyState = (type) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-[#003049]/10 to-[#d62828]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCalendar className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {type} appointments
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        {type === "upcoming" && "There are no scheduled upcoming appointments."}
        {type === "past" && "There are no completed or past appointments to display."}
        {type === "cancelled" && "There are no cancelled appointments to display."}
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#003049] to-[#d62828] bg-clip-text text-transparent">
                Appointments Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and track all counseling appointments</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003049]/20 focus:border-[#003049] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <input
                type="date"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003049]/20 focus:border-[#003049] transition-colors"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />

              {/* Status Filter */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003049]/20 focus:border-[#003049] transition-colors"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#003049] to-[#0056b3] text-white rounded-lg hover:from-[#002a3f] hover:to-[#004494] transition-all duration-200"
                onClick={() => {
                  setFilterDate("");
                  setFilterStatus("");
                  setSearchTerm("");
                }}
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="error" className="border-red-200 bg-red-50">
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: "upcoming", label: "Upcoming", count: stats.upcoming },
              { id: "past", label: "Past", count: appointments.past?.length || 0 },
              { id: "cancelled", label: "Cancelled", count: stats.cancelled },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-[#003049] shadow-sm"
                    : "text-gray-600 hover:text-[#003049]"
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-[#003049] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Spinner size="lg" className="text-[#003049] mb-4" />
              <p className="text-gray-600">Loading appointments...</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {(() => {
                const currentAppointments = appointments[activeTab] || [];
                const filteredAppointments = filterAppointments(currentAppointments);

                if (filteredAppointments.length === 0) {
                  return renderEmptyState(activeTab);
                }

                return filteredAppointments.map((appointment, index) =>
                  renderAppointmentCard(appointment, index)
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppointmentsManagement;

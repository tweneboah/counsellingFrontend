import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageCircle,
  FiBook,
  FiCalendar,
  FiArrowRight,
  FiSun,
  FiMoon,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiMic,
  FiBarChart2,
  FiSmile,
  FiActivity,
  FiZap,
} from "react-icons/fi";
import { Card, Badge, Button, Avatar } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import StudentService from "../../services/student.service";
import WarningsPanel from "../../components/student/WarningsPanel";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
    recentChats: [],
    journalEntries: [],
    moodHistory: [],
  });
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await StudentService.getDashboardData();

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("An error occurred while loading your dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get greeting icon
  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <FiSun className="text-[#fcbf49]" />;
    if (hour < 18) return <FiSun className="text-[#f77f00]" />;
    return <FiMoon className="text-[#003049]" />;
  };

  // Get mood emoji and color class
  const getMoodDisplay = (mood) => {
    if (!mood) return { emoji: "😐", colorClass: "bg-gray-100 text-gray-800" };

    if (mood.includes("Happy"))
      return {
        emoji: "😊",
        colorClass: "bg-gradient-to-r from-[#fcbf49] to-[#f77f00] text-white",
      };
    if (mood.includes("Calm"))
      return {
        emoji: "😌",
        colorClass: "bg-gradient-to-r from-[#003049] to-blue-600 text-white",
      };
    if (mood.includes("Sad"))
      return {
        emoji: "😢",
        colorClass: "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
      };
    if (mood.includes("Angry"))
      return {
        emoji: "😠",
        colorClass: "bg-gradient-to-r from-[#d62828] to-red-600 text-white",
      };
    if (mood.includes("Anxious"))
      return {
        emoji: "😰",
        colorClass: "bg-gradient-to-r from-[#f77f00] to-yellow-500 text-white",
      };

    return { emoji: "😐", colorClass: "bg-gray-100 text-gray-800" };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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

  const quickAccessCards = [
    {
      title: "AI Counselor",
      description: "Chat anytime, 24/7",
      link: "/chat",
      icon: FiMessageCircle,
      gradient: "from-[#003049] to-[#d62828]",
      emoji: "🤖",
    },
    {
      title: "Journal",
      description: "Record your thoughts",
      link: "/journal",
      icon: FiBook,
      gradient: "from-[#f77f00] to-[#fcbf49]",
      emoji: "📝",
    },
    {
      title: "Appointments",
      description: "Schedule a meeting",
      link: "/appointments",
      icon: FiCalendar,
      gradient: "from-[#d62828] to-[#f77f00]",
      emoji: "📅",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-[#fcbf49]/10 to-[#f77f00]/10 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-tr from-[#003049]/10 to-[#d62828]/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Dashboard Header */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-br from-[#003049] via-[#d62828] to-[#f77f00] rounded-2xl shadow-2xl p-8 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-4xl"
              >
                {getGreetingIcon()}
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl lg:text-4xl font-bold"
                >
                  {getGreeting()}, {currentUser?.fullName?.split(" ")[0]}! 👋
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-blue-100 text-lg"
                >
                  Welcome to your personal wellness dashboard
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-3 flex items-center space-x-4 text-sm text-blue-100"
                >
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {currentTime.toLocaleDateString()}
                  </div>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 lg:mt-0"
            >
              <Link to="/chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 flex items-center border border-white/20"
                >
                  <FiZap className="mr-2 h-5 w-5" />
                  Start New Conversation
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-4 right-4 w-3 h-3 bg-[#fcbf49] rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className="absolute bottom-6 right-20 w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#d62828] to-red-600 text-white px-6 py-4 rounded-xl shadow-lg border-l-4 border-red-700"
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            {error}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Quick Access Cards */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#003049] flex items-center">
                <FiStar className="mr-2 text-[#f77f00]" />
                Quick Access
              </h2>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center"
              >
                <FiActivity className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <div className="space-y-4">
              {quickAccessCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={card.link} className="block">
                    <div
                      className={`p-5 bg-gradient-to-r ${card.gradient} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white group`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors">
                          <span className="text-2xl">{card.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {card.title}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {card.description}
                          </p>
                        </div>
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Wellness Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-[#fcbf49]/10 to-[#f77f00]/10 rounded-xl border border-[#f77f00]/20"
            >
              <div className="flex items-start">
                <FiHeart className="w-5 h-5 text-[#d62828] mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#003049] text-sm mb-1">
                    💡 Daily Wellness Tip
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Take 5 deep breaths when you feel overwhelmed. Inhale for 4
                    seconds, hold for 4, exhale for 6.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#003049] flex items-center">
                <FiCalendar className="mr-2 text-[#f77f00]" />
                Upcoming Appointments
              </h2>
              <Link
                to="/appointments"
                className="text-[#f77f00] hover:text-[#d62828] flex items-center text-sm font-semibold transition-colors group"
              >
                View all
                <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </motion.div>
              ) : dashboardData.upcomingAppointments.length > 0 ? (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {dashboardData.upcomingAppointments.map(
                    (appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="border-2 border-gray-100 rounded-xl p-5 hover:border-[#f77f00] hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#003049] text-lg mb-2">
                              {appointment.title}
                            </h3>
                            <div className="space-y-1">
                              <p className="text-gray-600 text-sm flex items-center">
                                <FiCalendar className="mr-2 w-4 h-4 text-[#f77f00]" />
                                {formatDate(appointment.dateTime)} at{" "}
                                {formatTime(appointment.dateTime)}
                              </p>
                              <p className="text-gray-600 text-sm flex items-center">
                                <FiMic className="mr-2 w-4 h-4 text-[#f77f00]" />
                                {appointment.location}
                              </p>
                            </div>
                          </div>
                          {appointment.counselor && (
                            <div className="flex items-center ml-4">
                              <Avatar
                                src={appointment.counselor.profilePicture}
                                alt={appointment.counselor.name}
                                size="sm"
                                className="mr-3 ring-2 ring-[#fcbf49]"
                              />
                              <span className="text-sm font-medium text-[#003049]">
                                {appointment.counselor.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#fcbf49] to-[#f77f00] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCalendar className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">
                    No upcoming appointments
                  </p>
                  <Link to="/appointments">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Schedule an appointment
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats & Quick Info */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <div className="space-y-4">
            {/* Mood Tracker */}
            <div className="bg-gradient-to-br from-[#fcbf49] to-[#f77f00] rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Mood Check-in</h3>
                <FiSmile className="w-6 h-6" />
              </div>
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-4xl mb-2 cursor-pointer"
                >
                  😊
                </motion.div>
                <p className="text-white/90 text-sm">
                  How are you feeling today?
                </p>
                <Link to="/journal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
                  >
                    Track Mood
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#003049]">Weekly Summary</h3>
                <FiBarChart2 className="w-5 h-5 text-[#f77f00]" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Chat Sessions</span>
                  <span className="font-semibold text-[#003049]">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Journal Entries</span>
                  <span className="font-semibold text-[#003049]">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Mood Logs</span>
                  <span className="font-semibold text-[#003049]">7</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Conversations */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#003049] flex items-center">
                <FiMessageCircle className="mr-2 text-[#f77f00]" />
                Recent Conversations
              </h2>
              <Link
                to="/chat"
                className="text-[#f77f00] hover:text-[#d62828] flex items-center text-sm font-semibold transition-colors group"
              >
                View all
                <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </motion.div>
              ) : dashboardData.recentChats.length > 0 ? (
                <motion.div
                  key="chats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {dashboardData.recentChats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Link to={`/chat/${chat.id}`}>
                        <div className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#f77f00] hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#003049] to-[#d62828] flex items-center justify-center text-white mr-3 flex-shrink-0">
                                <FiMessageCircle size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[#003049] mb-1 truncate">
                                  {chat.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                  {chat.lastMessage || "No messages"}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {formatDate(chat.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#003049] to-[#d62828] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">
                    No recent conversations
                  </p>
                  <Link to="/chat">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#003049] to-[#d62828] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start a conversation
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Journal Entries */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#003049] flex items-center">
                <FiBook className="mr-2 text-[#f77f00]" />
                Recent Journal Entries
              </h2>
              <Link
                to="/journal"
                className="text-[#f77f00] hover:text-[#d62828] flex items-center text-sm font-semibold transition-colors group"
              >
                View all
                <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </motion.div>
              ) : dashboardData.journalEntries.length > 0 ? (
                <motion.div
                  key="entries"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {dashboardData.journalEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Link to={`/journal/${entry.id}`}>
                        <div className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#f77f00] hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-[#003049] truncate flex-1 pr-2">
                              {entry.title}
                            </h3>
                            {entry.mood && (
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  getMoodDisplay(entry.mood).colorClass
                                }`}
                              >
                                {getMoodDisplay(entry.mood).emoji}{" "}
                                {entry.mood.split(" ")[0]}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {entry.content}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center">
                            <FiClock className="mr-1 w-3 h-3" />
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBook className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-500 text-lg mb-4">
                    No journal entries yet
                  </p>
                  <Link to="/journal/new">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Create first entry
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Warnings Panel */}
      <motion.div variants={itemVariants}>
        <WarningsPanel />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

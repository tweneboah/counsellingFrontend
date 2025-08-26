import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiMessageCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiEye,
  FiClock,
  FiBook,
  FiUserCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { Card } from "../../components/ui";
import AdminService from "../../services/admin.service";

const StatCard = ({ icon, title, value, subtitle, trend, trendValue, bgGradient, iconBg, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative"
  >
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 ${bgGradient} opacity-5`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 truncate">{title}</p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{value}</h3>
            {subtitle && <p className="text-gray-500 text-xs truncate">{subtitle}</p>}
            {trend !== undefined && trendValue !== undefined && (
              <div className={`flex items-center mt-2 sm:mt-3 text-xs sm:text-sm ${
                trend > 0 ? "text-green-600" : trend < 0 ? "text-red-500" : "text-gray-500"
              }`}>
                {trend > 0 ? (
                  <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                ) : trend < 0 ? (
                  <FiTrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                ) : (
                  <FiActivity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                )}
                <span className="font-medium">
                  {trend === 0 ? "No change" : `${Math.abs(trendValue)}% ${trend > 0 ? "increase" : "decrease"}`}
                </span>
              </div>
            )}
          </div>
          <div className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl ${iconBg} shadow-lg flex-shrink-0 ml-2`}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);

const ActivityCard = ({ activity, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="flex items-center p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div className="flex-shrink-0 mr-3 sm:mr-4">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
        activity.type === "chat" ? "bg-blue-100 text-[#003049]" :
        activity.type === "appointment" ? "bg-orange-100 text-[#f77f00]" :
        activity.type === "student" ? "bg-green-100 text-green-600" :
        "bg-red-100 text-[#d62828]"
      }`}>
        {activity.type === "chat" && <FiMessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
        {activity.type === "appointment" && <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" />}
        {activity.type === "student" && <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" />}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
        {activity.title}
      </p>
      <p className="text-xs text-gray-500 mt-1 truncate">
        {activity.description}
      </p>
    </div>
    <div className="flex-shrink-0 text-xs text-gray-400 ml-2">
      {activity.time}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    counts: {},
    chatMetrics: {},
    categoryBreakdown: [],
    recentActivity: { chats: [], appointments: [] },
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await AdminService.getDashboardAnalytics();

        if (response.data && response.data.status === "success") {
          setDashboardData({
            ...response.data.data,
            loading: false,
            error: null,
          });
        } else {
          setDashboardData(prev => ({
            ...prev,
            loading: false,
            error: "Failed to load dashboard data",
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard data: " + error.message,
        }));
      }
    };

    fetchDashboardData();
  }, []);

  // Format recent activity data
  const formatRecentActivity = () => {
    const activities = [];
    
    // Add recent chats
    dashboardData.recentActivity.chats?.forEach(chat => {
      activities.push({
        type: "chat",
        title: chat.title || "New Chat Session",
        description: `with ${chat.studentName}`,
        time: new Date(chat.timestamp).toLocaleTimeString(),
      });
    });

    // Add recent appointments
    dashboardData.recentActivity.appointments?.forEach(appointment => {
      activities.push({
        type: "appointment",
        title: appointment.title || "New Appointment",
        description: `${appointment.studentName} → ${appointment.counselorName}`,
        time: new Date(appointment.date).toLocaleDateString(),
      });
    });

    return activities.slice(0, 8); // Show last 8 activities
  };

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/4 mb-6 sm:mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 sm:h-32 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="h-48 sm:h-64 bg-gray-100 rounded-xl"></div>
            <div className="h-48 sm:h-64 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 sm:p-6 rounded-xl">
          <div className="flex items-center">
            <FiAlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="font-medium text-sm sm:text-base">Error loading dashboard</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm">{dashboardData.error}</p>
        </div>
      </div>
    );
  }

  const { counts, chatMetrics, categoryBreakdown } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#003049] via-[#d62828] to-[#f77f00] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 flex items-center text-sm sm:text-base"
          >
            <FiActivity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Platform Overview & Analytics
          </motion.p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={<FiUsers className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#003049]" />}
            title="Total Students"
            value={counts.totalStudents?.toLocaleString() || "0"}
            subtitle={`${counts.recentStudentCount || 0} new this week`}
            trend={1}
            trendValue={12}
            bgGradient="bg-gradient-to-br from-blue-500 to-[#003049]"
            iconBg="bg-gradient-to-br from-blue-100 to-blue-50"
            delay={0}
          />

          <StatCard
            icon={<FiCalendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#f77f00]" />}
            title="Total Appointments"
            value={counts.totalAppointments?.toLocaleString() || "0"}
            subtitle="All time bookings"
            trend={1}
            trendValue={8}
            bgGradient="bg-gradient-to-br from-orange-500 to-[#f77f00]"
            iconBg="bg-gradient-to-br from-orange-100 to-orange-50"
            delay={0.1}
          />

          <StatCard
            icon={<FiMessageCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#fcbf49]" />}
            title="Chat Sessions"
            value={counts.totalChats?.toLocaleString() || "0"}
            subtitle={`${chatMetrics.totalMessages?.toLocaleString() || 0} total messages`}
            trend={1}
            trendValue={23}
            bgGradient="bg-gradient-to-br from-yellow-500 to-[#fcbf49]"
            iconBg="bg-gradient-to-br from-yellow-100 to-yellow-50"
            delay={0.2}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={<FiUserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />}
            title="Active Counselors"
            value={counts.totalCounselors?.toLocaleString() || "0"}
            subtitle="Available for appointments"
            bgGradient="bg-gradient-to-br from-green-500 to-green-600"
            iconBg="bg-gradient-to-br from-green-100 to-green-50"
            delay={0.4}
          />

          <StatCard
            icon={<FiBook className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />}
            title="Journal Entries"
            value={counts.totalJournals?.toLocaleString() || "0"}
            subtitle="Student reflections"
            bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
            iconBg="bg-gradient-to-br from-purple-100 to-purple-50"
            delay={0.5}
          />

          <StatCard
            icon={<FiActivity className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />}
            title="Avg Messages/Chat"
            value={Math.round(chatMetrics.averageMessagesPerChat || 0)}
            subtitle="Engagement metric"
            bgGradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
            iconBg="bg-gradient-to-br from-indigo-100 to-indigo-50"
            delay={0.6}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-4 sm:p-6 bg-white shadow-lg border-0">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <FiClock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#003049]" />
                  Recent Activity
                </h2>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <FiEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Live updates</span>
                  <span className="sm:hidden">Live</span>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                {formatRecentActivity().length > 0 ? (
                  formatRecentActivity().map((activity, index) => (
                    <ActivityCard key={index} activity={activity} index={index} />
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <FiActivity className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                    <p className="text-sm sm:text-base">No recent activity</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="p-4 sm:p-6 bg-white shadow-lg border-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#003049]" />
                <span className="hidden sm:inline">Chat Categories</span>
                <span className="sm:hidden">Categories</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {categoryBreakdown.length > 0 ? (
                  categoryBreakdown.map((category, index) => {
                    const colors = [
                      'from-[#003049] to-blue-600',
                      'from-[#d62828] to-red-600', 
                      'from-[#f77f00] to-orange-600',
                      'from-[#fcbf49] to-yellow-600',
                      'from-purple-500 to-purple-600'
                    ];
                    
                    return (
                      <motion.div
                        key={category._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${colors[index % colors.length]} mr-2 sm:mr-3 flex-shrink-0`}></div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize truncate">
                            {category._id || 'Uncategorized'}
                          </span>
                        </div>
                        <div className="flex items-center ml-2">
                          <span className="text-xs sm:text-sm font-bold text-gray-900 mr-1 sm:mr-2">
                            {category.count}
                          </span>
                          <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-1000`}
                              style={{ 
                                width: `${Math.min(100, (category.count / Math.max(...categoryBreakdown.map(c => c.count))) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <FiMessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                    <p className="text-sm sm:text-base">No chat data available</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

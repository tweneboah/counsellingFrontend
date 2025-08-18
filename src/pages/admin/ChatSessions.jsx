import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiEye,
  FiCalendar,
  FiMessageCircle,
  FiUsers,
  FiActivity,
  FiClock,
  FiFilter,
} from "react-icons/fi";
import {
  Card,
  Button,
  Input,
  Badge,
  Tabs,
  Pagination,
  Spinner,
} from "../../components/ui";
import AdminService from "../../services/admin.service";
import { formatDistanceToNow } from "date-fns";
import ChatHistoryModal from "../../components/admin/ChatHistoryModal";

const ChatSessions = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showChatHistoryModal, setShowChatHistoryModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchChatSessions();
  }, [pagination.currentPage, searchTerm, activeTab]);

  const fetchChatSessions = async () => {
    try {
      setLoading(true);

      const status = activeTab !== "all" ? activeTab : undefined;

      const response = await AdminService.getChatSessions(
        pagination.currentPage,
        pagination.pageSize,
        searchTerm,
        status
      );

      if (response.data && response.data.status === "success") {
        setChatSessions(response.data.data.chatSessions || []);
        setPagination({
          currentPage: response.data.data.currentPage || 1,
          totalPages: response.data.data.totalPages || 1,
          totalItems: response.data.data.totalItems || 0,
          pageSize: pagination.pageSize,
        });
      } else {
        setError("Failed to load chat sessions");
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      setError("An error occurred while loading chat sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleViewChatHistory = (session) => {
    setSelectedSession(session);
    setShowChatHistoryModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-[#003049]/10 text-[#003049] border-[#003049]/20";
      case "paused":
        return "bg-[#fcbf49]/20 text-[#f77f00] border-[#fcbf49]/30";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSessionStats = () => {
    const active = chatSessions.filter(s => s.status === "active").length;
    const completed = chatSessions.filter(s => s.status === "completed").length;
    const total = chatSessions.length;
    
    return { active, completed, total };
  };

  const renderChatSessionCard = (session, index) => (
    <motion.div
      key={session.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="mb-6"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
        <div className="relative">
          {/* Status indicator bar */}
          <div 
            className={`h-1 w-full ${
              session.status === "active" 
                ? "bg-gradient-to-r from-green-400 to-green-600" 
                : session.status === "completed"
                ? "bg-gradient-to-r from-[#003049] to-[#0056b3]"
                : "bg-gradient-to-r from-[#fcbf49] to-[#f77f00]"
            }`}
          />
          
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#003049] to-[#d62828] rounded-full flex items-center justify-center">
                      <FiUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                        {session.studentName}
                      </h3>
                      <p className="text-gray-600 text-sm">{session.studentEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`${getStatusColor(session.status)} px-2 sm:px-3 py-1 text-xs font-medium border`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                    {session.topic && (
                      <Badge className="bg-[#fcbf49]/20 text-[#f77f00] border-[#fcbf49]/30 px-2 sm:px-3 py-1 text-xs font-medium border">
                        {session.topic}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <FiCalendar className="w-4 h-4 mr-2 text-[#003049] flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500 block">Started</span>
                      <span className="font-medium text-xs sm:text-sm">{formatDate(session.startDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <FiMessageCircle className="w-4 h-4 mr-2 text-[#d62828] flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500 block">Messages</span>
                      <span className="font-medium text-xs sm:text-sm">{session.messagesCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 sm:col-span-2 lg:col-span-1">
                    <FiClock className="w-4 h-4 mr-2 text-[#f77f00] flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500 block">Last Activity</span>
                      <span className="font-medium text-xs sm:text-sm">{formatDate(session.lastMessageDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:ml-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full lg:w-auto"
                >
                  <Button
                    onClick={() => handleViewChatHistory(session)}
                    className="w-full lg:w-auto bg-gradient-to-r from-[#003049] to-[#0056b3] hover:from-[#002a3f] hover:to-[#004494] text-white border-0 shadow-lg px-4 sm:px-6 py-2 flex items-center justify-center space-x-2"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View Chat</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  const stats = getSessionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-[#003049] to-[#d62828] text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Chat Sessions</h1>
              <p className="text-blue-100 text-sm sm:text-base">Monitor and review student counseling sessions</p>
            </div>
            <div className="flex items-center justify-center lg:justify-end space-x-4 sm:space-x-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                <div className="text-xs sm:text-sm text-blue-100">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-300">{stats.active}</div>
                <div className="text-xs sm:text-sm text-blue-100">Active</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-300">{stats.completed}</div>
                <div className="text-xs sm:text-sm text-blue-100">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-4 sm:p-6 bg-white shadow-sm border-0">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between lg:gap-6">
              {/* Search input */}
              <div className="relative w-full lg:flex-1 lg:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Search by student name or email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-10 border-gray-200 focus:border-[#003049] focus:ring-[#003049]/20"
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center overflow-x-auto space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { id: "all", label: "All", fullLabel: "All Sessions", icon: FiActivity },
                  { id: "active", label: "Active", fullLabel: "Active", icon: FiUsers },
                  { id: "completed", label: "Completed", fullLabel: "Completed", icon: FiMessageCircle },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#003049] to-[#0056b3] text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{tab.fullLabel}</span>
                    <span className="sm:hidden">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
            >
              <div className="flex items-center">
                <FiX className="w-5 h-5 mr-2" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-16"
            >
              <div className="text-center">
                <Spinner size="lg" className="text-[#003049]" />
                <p className="mt-4 text-gray-600">Loading chat sessions...</p>
              </div>
            </motion.div>
          ) : chatSessions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <Card className="p-12 bg-gradient-to-br from-gray-50 to-white border-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#003049] to-[#d62828] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No chat sessions found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "No chat sessions match your search criteria"
                    : activeTab !== "all"
                    ? `No ${activeTab} chat sessions found`
                    : "There are no chat sessions to display"}
                </p>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{chatSessions.length}</span> of{" "}
                  <span className="font-medium">{pagination.totalItems}</span> chat sessions
                </p>
              </div>

              <div className="space-y-4">
                {chatSessions.map((session, index) => renderChatSessionCard(session, index))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex justify-center mt-8"
                >
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) =>
                      setPagination((prev) => ({ ...prev, currentPage: page }))
                    }
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat history modal */}
      <AnimatePresence>
        {showChatHistoryModal && selectedSession && (
          <ChatHistoryModal
            isOpen={showChatHistoryModal}
            onClose={() => setShowChatHistoryModal(false)}
            session={selectedSession}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatSessions;

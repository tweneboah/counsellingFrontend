import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiFlag, 
  FiDownload, 
  FiMessageCircle, 
  FiMail, 
  FiClock,
  FiCpu,
  FiAlertTriangle,
  FiX
} from "react-icons/fi";
import { Modal, Button, Spinner, Avatar } from "../ui";
import AdminService from "../../services/admin.service";

const ChatHistoryModal = ({ isOpen, onClose, session }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && session) {
      fetchChatHistory();
    }
  }, [isOpen, session]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getChatHistory(session.id);

      if (response.data && response.data.status === "success") {
        setChatHistory(response.data.data.messages || []);
      } else {
        setError("Failed to load chat history");
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setError("An error occurred while loading chat history");
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  const handleDownloadChat = () => {
    if (!chatHistory.length) return;

    const studentName = session.studentName || "student";
    const fileName = `chat-history-${studentName
      .toLowerCase()
      .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.txt`;

    let content = `Chat History with ${studentName}\n`;
    content += `Date: ${new Date().toDateString()}\n`;
    content += `Session ID: ${session.id}\n`;
    content += `Total Messages: ${chatHistory.length}\n\n`;
    content += `=======================================\n\n`;

    chatHistory.forEach((message) => {
      content += `[${formatTimestamp(message.timestamp)}] ${
        message.role === "student" ? studentName : "AI Counselor"
      }:\n`;
      content += `${message.content}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFlagMessage = async (messageId) => {
    try {
      const response = await AdminService.flagChatMessage(
        session.id,
        messageId,
        "Content requires attention"
      );

      if (response.data && response.data.status === "success") {
        // Update the UI to show the message has been flagged
        setChatHistory((prevHistory) =>
          prevHistory.map((msg) =>
            msg.id === messageId ? { ...msg, flagged: true } : msg
          )
        );
      } else {
        console.error("Failed to flag message");
      }
    } catch (error) {
      console.error("Error flagging message:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      size="4xl"
      className="max-h-[90vh] mx-4 sm:mx-auto"
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-[#003049] to-[#d62828] text-white p-4 sm:p-6 -m-4 sm:-m-6 mb-4 sm:mb-6 rounded-t-lg relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiX className="w-5 h-5 text-white" />
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pr-12">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Chat History</h2>
                <p className="text-blue-100 text-xs sm:text-sm">Session conversation details</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={handleDownloadChat}
                disabled={chatHistory.length === 0 || loading}
                className="w-full sm:w-auto bg-white/20 hover:bg-white/30 border-white/30 text-white flex items-center justify-center space-x-2 backdrop-blur-sm text-sm"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download Chat</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Student Info Card */}
        <motion.div 
          className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 rounded-xl border border-gray-100 mb-4 sm:mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#003049] to-[#d62828] rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{session.studentName}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <FiMail className="w-4 h-4 mr-2" />
                  <span className="text-xs sm:text-sm break-all">{session.studentEmail}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:text-right space-y-1">
              <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                <FiClock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#f77f00]" />
                <span>Started {formatTimestamp(session.startDate)}</span>
              </div>
              <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                <FiMessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#d62828]" />
                <span>{chatHistory.length} messages</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0">
          <div className="h-full bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col justify-center items-center h-full py-16"
              >
                <Spinner size="lg" className="text-[#003049]" />
                <p className="mt-4 text-gray-600">Loading chat history...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col justify-center items-center h-full py-16"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FiAlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 text-center">{error}</p>
              </motion.div>
            ) : chatHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col justify-center items-center h-full py-16"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiMessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center">No messages found</p>
              </motion.div>
            ) : (
              <div className="h-full overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                <AnimatePresence>
                  {chatHistory.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex ${
                        message.role === "student" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div className={`flex max-w-[90%] sm:max-w-[80%] ${
                        message.role === "student" ? "flex-row" : "flex-row-reverse"
                      }`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 ${
                          message.role === "student" ? "mr-2 sm:mr-3" : "ml-2 sm:ml-3"
                        }`}>
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                            message.role === "student"
                              ? "bg-gradient-to-br from-[#003049] to-[#0056b3]"
                              : "bg-gradient-to-br from-[#f77f00] to-[#fcbf49]"
                          }`}>
                            {message.role === "student" ? (
                              <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              <FiCpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            )}
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className={`relative group ${
                          message.role === "student" ? "mr-2 sm:mr-4" : "ml-2 sm:ml-4"
                        }`}>
                          {/* Message Bubble */}
                          <div className={`relative p-3 sm:p-4 rounded-2xl shadow-sm ${
                            message.role === "student"
                              ? message.flagged
                                ? "bg-red-50 border-2 border-red-200"
                                : "bg-white border border-gray-200 shadow-md"
                              : "bg-gradient-to-br from-[#f77f00]/10 to-[#fcbf49]/10 border border-[#f77f00]/20"
                          } ${
                            message.role === "student" ? "rounded-tl-sm" : "rounded-tr-sm"
                          }`}>
                            
                            {/* Message Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <span className={`text-xs sm:text-sm font-semibold ${
                                  message.role === "student" ? "text-[#003049]" : "text-[#f77f00]"
                                }`}>
                                  {message.role === "student" ? session.studentName : "AI Counselor"}
                                </span>
                                <span className="text-xs text-gray-500 hidden sm:inline">
                                  {formatTimestamp(message.timestamp)}
                                </span>
                              </div>
                              
                              {/* Flag Button for Student Messages */}
                              {message.role === "student" && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className={`p-1 rounded-full transition-all duration-200 ${
                                    message.flagged
                                      ? "text-red-500 bg-red-100"
                                      : "opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                  }`}
                                  onClick={() => !message.flagged && handleFlagMessage(message.id)}
                                  title={message.flagged ? "Message flagged" : "Flag this message"}
                                  disabled={message.flagged}
                                >
                                  <FiFlag className="w-3 h-3 sm:w-4 sm:h-4" />
                                </motion.button>
                              )}
                            </div>

                            {/* Timestamp for mobile */}
                            <div className="sm:hidden mb-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>

                            {/* Message Text */}
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                              {message.content}
                            </p>

                            {/* Flagged Indicator */}
                            {message.flagged && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center mt-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full w-fit"
                              >
                                <FiFlag className="w-3 h-3 mr-1" />
                                <span>Flagged for review</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>


      </div>
    </Modal>
  );
};

export default ChatHistoryModal;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiMessageCircle,
  FiX,
  FiSearch,
  FiPlus,
  FiClock,
  FiZap,
  FiStar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Button, IconButton, Input, Badge } from "../ui";
import CounselingService from "../../services/counseling.service";

const ChatSessionList = ({
  onSelectChat,
  selectedChatId,
  onNewChat,
  className = "",
}) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await CounselingService.getChatSessions();
      console.log("Chat sessions response:", response);

      if (response.data && response.data.status === "success") {
        setChatSessions(response.data.data.chats || []);
      } else {
        setError(response.data?.message || "Failed to load chat sessions");
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      setError("An error occurred while loading chat sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Filter chats based on search term
  const filteredChats = chatSessions.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl h-full flex flex-col border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#003049] to-[#d62828] p-6 relative overflow-hidden"
      >
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-3 right-4 w-2 h-2 bg-[#fcbf49] rounded-full opacity-60"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-[#f77f00] rounded-full opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 0.5,
          }}
        />

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white mb-4 flex items-center"
        >
          <FiMessageCircle className="mr-2 text-[#fcbf49]" />
          Chat Sessions
        </motion.h2>

        {/* Enhanced Search bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-4"
        >
          <Input
            placeholder="Search conversations... 🔍"
            value={searchTerm}
            onChange={handleSearch}
            className="pr-10 bg-white/90 backdrop-blur-sm border-white/20 focus:border-[#fcbf49] rounded-xl shadow-lg"
          />
          {searchTerm ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#f77f00]"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FiX size={18} />
            </motion.button>
          ) : (
            <FiSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          )}
        </motion.div>

        {/* Enhanced New chat button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="primary"
            className="w-full bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#fcbf49] hover:to-[#f77f00] border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
            onClick={onNewChat}
          >
            <FiPlus className="mr-2" />
            Start New Conversation
          </Button>
        </motion.div>
      </motion.div>

      {/* Chat list with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-32"
            >
              <div className="flex space-x-2">
                <motion.div
                  className="w-3 h-3 bg-[#f77f00] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#fcbf49] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-3 h-3 bg-[#d62828] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 text-center"
            >
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </motion.div>
          ) : filteredChats.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-500 mb-2 font-medium">
                {searchTerm
                  ? "No matching conversations found"
                  : "No conversations yet"}
              </p>
              <p className="text-gray-400 text-sm">
                {searchTerm
                  ? "Try a different search term"
                  : "Start your first conversation with our AI counselor!"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="chats"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-3"
            >
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer rounded-2xl transition-all duration-300 border-2 ${
                    selectedChatId === chat.id
                      ? "bg-gradient-to-r from-[#fcbf49]/20 to-[#f77f00]/10 border-[#f77f00] shadow-lg"
                      : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white border-gray-100 hover:border-[#f77f00]/50 shadow-sm hover:shadow-md"
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                            selectedChatId === chat.id
                              ? "bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white"
                              : "bg-gradient-to-r from-[#003049] to-[#d62828] text-white"
                          }`}
                        >
                          <FiMessageCircle size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`text-sm font-bold truncate ${
                              selectedChatId === chat.id
                                ? "text-[#003049]"
                                : "text-gray-900"
                            }`}
                          >
                            {chat.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <FiClock className="w-3 h-3 mr-1" />
                            {formatDate(chat.lastMessageAt || chat.startedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {chat.messageCount > 0 && (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              selectedChatId === chat.id
                                ? "bg-[#f77f00] text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {chat.messageCount}
                          </span>
                        )}
                        {chat.isUnread && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Badge
                              variant="primary"
                              className="bg-gradient-to-r from-[#d62828] to-[#f77f00] text-white border-0"
                            >
                              New
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {chat.lastMessage && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-600 truncate pl-13 leading-relaxed"
                      >
                        {chat.lastMessage}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatSessionList;

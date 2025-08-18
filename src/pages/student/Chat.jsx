import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiZap, FiStar } from "react-icons/fi";
import { ChatInterface, ChatSessionList } from "../../components/counseling";

const Chat = () => {
  const { chatId } = useParams();
  const [selectedChatId, setSelectedChatId] = useState(chatId || null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
  };

  const handleStartNewChat = () => {
    setSelectedChatId(null);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // On mobile, show either the chat list or the selected chat
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[calc(100vh-8rem)] relative"
      >
        <AnimatePresence mode="wait">
          {selectedChatId ? (
            <motion.div
              key="chat-interface"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ChatInterface
                key={selectedChatId || "new-chat"}
                existingChatId={selectedChatId}
                onStartNewChat={handleStartNewChat}
                onBackToList={handleBackToList}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat-list"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ChatSessionList
                onSelectChat={handleSelectChat}
                onNewChat={handleStartNewChat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // On desktop, show both the chat list and selected chat side by side
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      variants={containerVariants}
      className="h-[calc(100vh-8rem)] relative"
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-4 right-8 w-4 h-4 bg-[#fcbf49] rounded-full opacity-20"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-8 left-8 w-3 h-3 bg-[#f77f00] rounded-full opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 1,
        }}
      />

      <div className="h-full flex bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Chat Session List Side */}
        <motion.div
          variants={itemVariants}
          className="w-80 border-r-2 border-gray-100 flex-shrink-0 relative"
        >
          {/* Gradient divider */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#003049] via-[#d62828] to-[#f77f00] opacity-50"></div>

          <ChatSessionList
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChatId}
            onNewChat={handleStartNewChat}
            className="h-full border-0 shadow-none bg-transparent"
          />
        </motion.div>

        {/* Chat Interface Side */}
        <motion.div variants={itemVariants} className="flex-1 relative">
          <AnimatePresence mode="wait">
            {selectedChatId ? (
              <motion.div
                key={selectedChatId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ChatInterface
                  key={selectedChatId || "new-chat"}
                  existingChatId={selectedChatId}
                  onStartNewChat={handleStartNewChat}
                  className="border-0 shadow-none rounded-none bg-transparent"
                />
              </motion.div>
            ) : (
              <motion.div
                key="new-conversation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ChatInterface
                  key="new-chat"
                  existingChatId={null}
                  onStartNewChat={handleStartNewChat}
                  className="border-0 shadow-none rounded-none bg-transparent"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Chat;

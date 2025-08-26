import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiBook,
  FiHeart,
  FiStar,
  FiZap,
  FiEye,
  FiCalendar,
  FiLock,
  FiSmile,
} from "react-icons/fi";
import { Button, Card, Input, Badge, SuccessModal, ConfirmationModal } from "../ui";
import JournalService from "../../services/journal.service";

const JournalList = ({ onSelectEntry, className = "" }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    loadJournalEntries(currentPage);
  }, [currentPage]);

  const loadJournalEntries = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await JournalService.getJournalEntries(
        page,
        10,
        searchTerm
      );

      if (response.data.status === "success") {
        setEntries(response.data.data.journals);
        setTotalPages(response.data.totalPages);
        setTotalEntries(response.data.totalEntries);
      } else {
        setError(response.data.message || "Failed to load journal entries");
      }
    } catch (error) {
      console.error("Error loading journal entries:", error);
      setError("An error occurred while loading journal entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadJournalEntries(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    loadJournalEntries(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteEntry = (entryId, e) => {
    e.stopPropagation();
    setEntryToDelete(entryId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      const response = await JournalService.deleteJournalEntry(entryToDelete);

      if (response.data.status === "success") {
        // Show success notification
        setSuccessMessage("Journal entry deleted successfully!");
        setShowSuccessModal(true);
        // Refresh the list
        loadJournalEntries(currentPage);
      } else {
        setError(response.data.message || "Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError("An error occurred while deleting the entry");
    } finally {
      setEntryToDelete(null);
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setEntryToDelete(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: "😊",
      sad: "😢",
      excited: "🎉",
      anxious: "😰",
      calm: "😌",
      angry: "😠",
      grateful: "🙏",
      stressed: "😵",
      content: "😊",
      overwhelmed: "😵‍💫",
    };
    return moodMap[mood?.toLowerCase()] || "😊";
  };

  // Get mood color
  const getMoodColor = (mood) => {
    const colorMap = {
      happy: "from-yellow-100 to-yellow-200 text-yellow-800",
      sad: "from-blue-100 to-blue-200 text-blue-800",
      excited: "from-purple-100 to-purple-200 text-purple-800",
      anxious: "from-red-100 to-red-200 text-red-800",
      calm: "from-green-100 to-green-200 text-green-800",
      angry: "from-red-100 to-red-200 text-red-800",
      grateful: "from-pink-100 to-pink-200 text-pink-800",
      stressed: "from-gray-100 to-gray-200 text-gray-800",
      content: "from-emerald-100 to-emerald-200 text-emerald-800",
      overwhelmed: "from-orange-100 to-orange-200 text-orange-800",
    };
    return (
      colorMap[mood?.toLowerCase()] || "from-gray-100 to-gray-200 text-gray-800"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-8 relative ${className}`}
    >
      {/* Background decorative elements */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-gradient-to-br from-[#fcbf49]/5 to-[#f77f00]/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-[#d62828]/5 to-[#003049]/5 rounded-full blur-2xl"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#003049] to-[#d62828] rounded-2xl p-8 text-white relative overflow-hidden"
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

        <div className="flex justify-between items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold flex items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#fcbf49] to-[#f77f00] rounded-full flex items-center justify-center mr-4">
                <FiBook className="w-5 h-5 text-white" />
              </div>
              My Journal
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 mt-2 flex items-center"
            >
              <FiHeart className="mr-2 w-4 h-4 text-[#f77f00]" />
              Express your thoughts and track your emotional journey
            </motion.p>
          </div>

          <Link to="/journal/new">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                className="bg-gradient-to-r from-[#fcbf49] to-[#f77f00] hover:from-[#f77f00] hover:to-[#fcbf49] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 flex items-center"
              >
                <FiPlus className="mr-2 w-5 h-5" />
                New Entry
              </Button>
            </motion.div>
          </Link>
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

        <div className="p-8">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-8 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 rounded-xl text-sm flex items-center"
              >
                <FiX className="mr-3 w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 relative"
          >
            <div className="relative">
              <Input
                placeholder="Search your journal entries... 📖"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-16 py-4 text-lg border-2 border-gray-200 focus:border-[#f77f00] rounded-xl bg-white shadow-sm focus:shadow-md transition-all duration-300 placeholder-gray-400"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f77f00] w-5 h-5" />

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {searchTerm ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-all duration-300"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <FiX size={18} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] p-2 rounded-lg transition-all duration-300 shadow-lg"
                    onClick={handleSearch}
                    aria-label="Search"
                  >
                    <FiZap size={18} />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Entries grid */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: [-100, 400] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : entries.length === 0 ? (
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
                <FiBook className="h-10 w-10 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-[#003049] mb-2">
                {searchTerm ? "No entries found" : "Start your journal journey"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {searchTerm
                  ? `No journal entries match "${searchTerm}". Try a different search term.`
                  : "Begin documenting your thoughts, experiences, and emotions. Your first entry is just a click away."}
              </p>

              {!searchTerm && (
                <Link to="/journal/new">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="primary"
                      className="bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FiPlus className="mr-2 w-5 h-5" />
                      Create your first entry
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#f77f00] cursor-pointer relative overflow-hidden group"
                    onClick={() =>
                      onSelectEntry ? onSelectEntry(entry) : null
                    }
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-2 right-4 w-3 h-3 bg-[#fcbf49] rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute bottom-4 right-2 w-2 h-2 bg-[#f77f00] rounded-full opacity-15 group-hover:opacity-30 transition-opacity"></div>

                    <Link to={`/journal/${entry._id}`} className="block h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <motion.h3
                            className="text-lg font-bold text-[#003049] truncate pr-4 group-hover:text-[#d62828] transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            {entry.title}
                          </motion.h3>

                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {entry.isPrivate && (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 px-2 py-1 rounded-full flex items-center text-xs font-semibold"
                              >
                                <FiLock className="w-3 h-3 mr-1" />
                                Private
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {entry.mood && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4"
                          >
                            <div
                              className={`inline-flex items-center px-3 py-2 text-xs font-semibold rounded-full bg-gradient-to-r ${getMoodColor(
                                entry.mood
                              )}`}
                            >
                              <span className="mr-2 text-lg">
                                {getMoodEmoji(entry.mood)}
                              </span>
                              {entry.mood}
                            </div>
                          </motion.div>
                        )}

                        <p className="text-gray-600 text-sm line-clamp-4 mb-6 flex-grow leading-relaxed">
                          {entry.content}
                        </p>

                        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center">
                            <FiCalendar className="w-3 h-3 mr-1 text-[#f77f00]" />
                            <span className="font-medium">
                              {formatDate(entry.createdAt)}
                            </span>
                          </div>

                          <div className="flex space-x-3">
                            <Link
                              to={`/journal/${entry._id}`}
                              className="text-gray-400 hover:text-[#003049] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1"
                              >
                                <FiEye className="w-4 h-4" />
                              </motion.div>
                            </Link>

                            <Link
                              to={`/journal/${entry._id}/edit`}
                              className="text-gray-400 hover:text-[#f77f00] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </motion.div>
                            </Link>

                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleDeleteEntry(entry._id, e)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mt-12 bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200"
            >
              <div className="text-sm text-gray-600 flex items-center">
                <FiStar className="w-4 h-4 mr-2 text-[#f77f00]" />
                Showing{" "}
                <span className="font-semibold mx-1">
                  {entries.length}
                </span> of{" "}
                <span className="font-semibold mx-1">{totalEntries}</span>{" "}
                entries
              </div>

              <div className="flex space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-[#f77f00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Previous
                  </Button>
                </motion.div>

                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={currentPage === i + 1 ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                          currentPage === i + 1
                            ? "bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white border-0 shadow-lg"
                            : "border-2 border-gray-300 hover:border-[#f77f00] text-gray-700"
                        }`}
                      >
                        {i + 1}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-[#f77f00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message={successMessage}
        buttonText="Continue"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeleteEntry}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={loading}
      />
    </motion.div>
  );
};

export default JournalList;

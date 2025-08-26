import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBook,
  FiEye,
  FiSearch,
  FiX,
  FiFilter,
  FiChevronDown,
  FiRefreshCw,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import AdminService from "../../services/admin.service";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import Pagination from "../../components/ui/Pagination";

const JournalsManagement = () => {
  const [allJournals, setAllJournals] = useState([]); // Store all journals
  const [filteredJournals, setFilteredJournals] = useState([]); // Store filtered journals
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [filters, setFilters] = useState({
    mood: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  useEffect(() => {
    fetchJournals();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    // Apply filters when filters change or journals are updated
    applyFilters();
  }, [allJournals, filters]);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await AdminService.getAllJournals(
        currentPage,
        limit,
        searchTerm
      );

      const journals = response.data.data.journals || [];
      setAllJournals(journals);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch journals. Please try again.");
      console.error("Error fetching journals:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allJournals];

    // Apply mood filter
    if (filters.mood !== "all") {
      filtered = filtered.filter(journal => 
        journal.mood && journal.mood.toLowerCase() === filters.mood.toLowerCase()
      );
    }

    setFilteredJournals(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      mood: "all",
    });
    setCurrentPage(1);
  };

  const handleViewJournal = (journal) => {
    setSelectedJournal(journal);
    setShowJournalModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      Happy: "bg-green-100 text-green-800",
      Sad: "bg-blue-100 text-blue-800",
      Anxious: "bg-red-100 text-red-800",
      Calm: "bg-purple-100 text-purple-800",
      Stressed: "bg-orange-100 text-orange-800",
      Angry: "bg-red-100 text-red-800",
      Confused: "bg-yellow-100 text-yellow-800",
      Neutral: "bg-gray-100 text-gray-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return moodColors[mood] || moodColors.Neutral;
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "Happy": return "😊";
      case "Sad": return "😢";
      case "Anxious": return "😰";
      case "Calm": return "😌";
      case "Stressed": return "😤";
      case "Angry": return "😠";
      case "Confused": return "😕";
      default: return "😐";
    }
  };

  // Use filtered journals for display
  const journalsToDisplay = filteredJournals;
  const filteredCount = journalsToDisplay.length;

  const JournalCard = ({ journal }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FiBook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {journal.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                by {journal.studentName}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            <Badge variant="secondary" className={`${getMoodColor(journal.mood)} text-xs`}>
              <span className="mr-1">{getMoodIcon(journal.mood)}</span>
              {journal.mood}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
            <div className="flex items-center">
              <FiUser className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="font-medium">Student ID:</span>
              <span className="ml-1 truncate">{journal.studentId}</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="font-medium">Created:</span>
            <span className="ml-1 truncate">{formatDate(journal.createdAt)}</span>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-3 bg-gray-50 p-2 sm:p-3 rounded-lg">
            {journal.content}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
            {journal.isPrivate && (
              <Badge variant="secondary" className="text-xs">
                Private
              </Badge>
            )}
            {journal.tags && journal.tags.length > 0 && (
              <div className="flex items-center space-x-1 flex-wrap">
                {journal.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {journal.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{journal.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewJournal(journal)}
              className="flex items-center space-x-1 w-full sm:w-auto justify-center text-xs sm:text-sm"
            >
              <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>View</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003049] to-[#0056b3] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Journal Management</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                View and manage all student journal entries
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <Button
                variant="secondary"
                onClick={fetchJournals}
                disabled={loading}
                className="flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <FiRefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">↻</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 text-white border-white hover:bg-white/10 text-sm sm:text-base"
              >
                <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">⚙</span>
                <FiChevronDown
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search journals..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-9 sm:pl-10 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent text-sm sm:text-base"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              {filters.mood !== "all" ? (
                <>
                  {filteredCount} of {totalCount} journal{totalCount !== 1 ? "s" : ""} 
                  {filteredCount !== totalCount && (
                    <span className="text-blue-600 font-medium"> (filtered by mood)</span>
                  )}
                </>
              ) : (
                <>
                  {totalCount} journal{totalCount !== 1 ? "s" : ""} found
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 sm:mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center sm:text-left">
                  Filter Options
                </h3>
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">
                      Mood
                    </label>
                    <select
                      value={filters.mood}
                      onChange={(e) => handleFilterChange("mood", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="all">All Moods</option>
                      <option value="Happy">😊 Happy</option>
                      <option value="Sad">😢 Sad</option>
                      <option value="Anxious">😰 Anxious</option>
                      <option value="Calm">😌 Calm</option>
                      <option value="Stressed">😤 Stressed</option>
                      <option value="Angry">😠 Angry</option>
                      <option value="Confused">😕 Confused</option>
                      <option value="Neutral">😐 Neutral</option>
                    </select>
                  </div>
                  <div className="flex items-end justify-center sm:justify-start">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full sm:w-auto text-sm sm:text-base"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
                {filters.mood !== "all" && (
                  <div className="mt-3 sm:mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800 text-center sm:text-left">
                      <strong>Active Filter:</strong> Showing only journals with mood "{filters.mood}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading journals...</p>
            </div>
          </div>
        ) : journalsToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-6 bg-blue-50 rounded-xl inline-block">
              <FiBook className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Journals Found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filters.mood !== "all"
                  ? "No journals match your current filters."
                  : "No journal entries have been created yet."}
              </p>
              {filters.mood !== "all" && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Mood Filter
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {journalsToDisplay.map((journal) => (
                <JournalCard key={journal._id} journal={journal} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Journal View Modal */}
      <Modal
        isOpen={showJournalModal}
        onClose={() => {
          setShowJournalModal(false);
          setSelectedJournal(null);
        }}
        title="Journal Entry Details"
        size="lg"
      >
        {selectedJournal && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Student:</span>{" "}
                  {selectedJournal.studentName}
                </div>
                <div>
                  <span className="font-medium">Student ID:</span>{" "}
                  {selectedJournal.studentId}
                </div>
                <div>
                  <span className="font-medium">Mood:</span>{" "}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getMoodColor(selectedJournal.mood)}`}>
                    {getMoodIcon(selectedJournal.mood)} {selectedJournal.mood}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(selectedJournal.createdAt)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {selectedJournal.title}
              </h4>
              <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedJournal.fullContent || selectedJournal.content}
                </p>
              </div>
            </div>

            {selectedJournal.tags && selectedJournal.tags.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Tags:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedJournal.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 justify-end pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowJournalModal(false);
                  setSelectedJournal(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JournalsManagement;
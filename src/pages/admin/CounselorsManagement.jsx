import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Card, Button, Input, Badge, Tabs, Modal, Spinner, Alert } from "../../components/ui";
import RegisterCounselorForm from "../../components/admin/RegisterCounselorForm";
import AdminService from "../../services/admin.service";

const CounselorsManagement = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    counselors: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchCounselors();
  }, [pagination.currentPage, searchTerm, filterRole, filterStatus]);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllCounselors(
        pagination.currentPage,
        10,
        searchTerm || undefined
      );

      if (response.data && response.data.status === "success") {
        const counselorsList = response.data.data.counselors || [];
        setCounselors(counselorsList);
        
        // Calculate stats
        const totalCounselors = counselorsList.length;
        const activeCounselors = counselorsList.filter(c => c.isActive).length;
        const inactiveCounselors = totalCounselors - activeCounselors;
        const adminCount = counselorsList.filter(c => c.role === 'admin').length;
        const counselorCount = counselorsList.filter(c => c.role === 'counselor').length;

        setStats({
          total: totalCounselors,
          active: activeCounselors,
          inactive: inactiveCounselors,
          admins: adminCount,
          counselors: counselorCount,
        });

        setPagination({
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalCounselors || 0,
        });
      } else {
        setError("Failed to load counselors");
      }
    } catch (error) {
      console.error("Error fetching counselors:", error);
      setError("An error occurred while loading counselors");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("");
    setFilterStatus("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    fetchCounselors();
  };

  const toggleCounselorStatus = async (counselorId, isActive) => {
    try {
      await AdminService.toggleCounselorStatus(counselorId, !isActive);
      setCounselors((prev) =>
        prev.map((c) =>
          c._id === counselorId ? { ...c, isActive: !isActive } : c
        )
      );
      // Update stats
      fetchCounselors();
    } catch (error) {
      console.error("Error toggling counselor status:", error);
      setError("Failed to update counselor status");
    }
  };

  const viewCounselorDetails = (counselor) => {
    setSelectedCounselor(counselor);
    setShowDetailsModal(true);
  };

  // Get role badge with brand colors
  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <div className="flex items-center px-2 py-1 bg-[#d62828]/10 text-[#d62828] rounded-full text-xs font-medium">
            <FiShield className="w-3 h-3 mr-1" />
            Admin
          </div>
        );
      case "counselor":
        return (
          <div className="flex items-center px-2 py-1 bg-[#f77f00]/10 text-[#f77f00] rounded-full text-xs font-medium">
            <FiUser className="w-3 h-3 mr-1" />
            Counselor
          </div>
        );
      case "moderator":
        return (
          <div className="flex items-center px-2 py-1 bg-[#fcbf49]/20 text-[#f77f00] rounded-full text-xs font-medium">
            <FiUsers className="w-3 h-3 mr-1" />
            Moderator
          </div>
        );
      default:
        return (
          <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            {role}
          </div>
        );
    }
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <div className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        <FiUserCheck className="w-3 h-3 mr-1" />
        Active
      </div>
    ) : (
      <div className="flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
        <FiUserX className="w-3 h-3 mr-1" />
        Inactive
      </div>
    );
  };

  // Filter counselors based on filters
  const filteredCounselors = counselors.filter(counselor => {
    const matchesRole = !filterRole || counselor.role === filterRole;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && counselor.isActive) ||
      (filterStatus === 'inactive' && !counselor.isActive);
    
    return matchesRole && matchesStatus;
  });

  // Render stats cards
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#003049] to-[#0056b3] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Counselors</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiUsers className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Active</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiUserCheck className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Inactive</p>
            <p className="text-2xl font-bold">{stats.inactive}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiUserX className="w-6 h-6" />
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
            <p className="text-red-100 text-sm font-medium">Admins</p>
            <p className="text-2xl font-bold">{stats.admins}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiShield className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-[#f77f00] to-[#fcbf49] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Counselors</p>
            <p className="text-2xl font-bold">{stats.counselors}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FiUser className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Render counselor card
  const renderCounselorCard = (counselor, index) => (
    <motion.div
      key={counselor._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className={`h-1 bg-gradient-to-r ${
        counselor.role === 'admin' 
          ? 'from-[#d62828] to-[#f77f00]' 
          : 'from-[#f77f00] to-[#fcbf49]'
      }`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              counselor.role === 'admin' 
                ? 'bg-gradient-to-br from-[#d62828] to-[#f77f00]' 
                : 'bg-gradient-to-br from-[#f77f00] to-[#fcbf49]'
            }`}>
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {counselor.fullName}
              </h3>
              <p className="text-gray-500 text-sm">ID: {counselor.staffId}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(counselor.isActive)}
            {getRoleBadge(counselor.role)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 text-sm">
              <FiMail className="w-4 h-4 mr-2 text-[#003049]" />
              {counselor.email}
            </div>
            {counselor.phoneNumber && (
              <div className="flex items-center text-gray-600 text-sm">
                <FiPhone className="w-4 h-4 mr-2 text-[#f77f00]" />
                {counselor.phoneNumber}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 text-sm">
              <FiMapPin className="w-4 h-4 mr-2 text-[#d62828]" />
              {counselor.department}
            </div>
            {counselor.gender && (
              <div className="flex items-center text-gray-600 text-sm">
                <FiUser className="w-4 h-4 mr-2 text-gray-400" />
                {counselor.gender}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Joined {new Date(counselor.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-2 bg-[#003049]/10 text-[#003049] rounded-lg hover:bg-[#003049]/20 transition-colors text-sm font-medium"
              onClick={() => viewCounselorDetails(counselor)}
            >
              <FiEye className="w-4 h-4 mr-1" />
              View
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                counselor.isActive
                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
              onClick={() => toggleCounselorStatus(counselor._id, counselor.isActive)}
            >
              {counselor.isActive ? (
                <>
                  <FiUserX className="w-4 h-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <FiUserCheck className="w-4 h-4 mr-1" />
                  Activate
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-2 bg-[#f77f00]/10 text-[#f77f00] rounded-lg hover:bg-[#f77f00]/20 transition-colors text-sm font-medium"
            >
              <FiEdit2 className="w-4 h-4 mr-1" />
              Edit
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-[#003049]/10 to-[#d62828]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiUsers className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm || filterRole || filterStatus ? "No counselors found" : "No counselors registered"}
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        {searchTerm || filterRole || filterStatus
          ? "No counselors match your search criteria. Try adjusting your filters."
          : "Get started by registering your first counselor."}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#003049] to-[#0056b3] text-white rounded-lg hover:from-[#002a3f] hover:to-[#004494] transition-all duration-200 font-medium"
        onClick={() => setShowRegisterModal(true)}
      >
        <FiPlus className="w-5 h-5 mr-2" />
        Register New Counselor
      </motion.button>
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
                Counselors Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor all counselors and administrators</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#003049] to-[#0056b3] text-white rounded-lg hover:from-[#002a3f] hover:to-[#004494] transition-all duration-200 font-medium"
              onClick={() => setShowRegisterModal(true)}
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Register New Counselor
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003049]/20 focus:border-[#003049] transition-colors"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Role Filter */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003049]/20 focus:border-[#003049] transition-colors"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="counselor">Counselor</option>
                <option value="moderator">Moderator</option>
              </select>

              {/* Status Filter */}
              <select
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003049]/20 focus:border-[#003049] transition-colors"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              onClick={clearFilters}
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Clear Filters
            </motion.button>
          </div>
        </motion.div>

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
              <p className="text-gray-600">Loading counselors...</p>
            </motion.div>
          ) : filteredCounselors.length === 0 ? (
            renderEmptyState()
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredCounselors.map((counselor, index) =>
                renderCounselorCard(counselor, index)
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-8"
                >
                  <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-[#003049] hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: Math.max(1, prev.currentPage - 1),
                        }))
                      }
                      disabled={pagination.currentPage === 1}
                    >
                      <FiChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </motion.button>
                    
                    <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-[#003049] hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          currentPage: Math.min(prev.totalPages, prev.currentPage + 1),
                        }))
                      }
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      Next
                      <FiChevronRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Modal */}
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Register New Counselor"
          size="lg"
        >
          <RegisterCounselorForm onSuccess={handleRegisterSuccess} />
        </Modal>

        {/* Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Counselor Details"
          size="lg"
        >
          {selectedCounselor && (
            <div className="space-y-6">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                  selectedCounselor.role === 'admin' 
                    ? 'bg-gradient-to-br from-[#d62828] to-[#f77f00]' 
                    : 'bg-gradient-to-br from-[#f77f00] to-[#fcbf49]'
                }`}>
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedCounselor.fullName}
                  </h3>
                  <p className="text-gray-500">ID: {selectedCounselor.staffId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedCounselor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedCounselor.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900">{selectedCounselor.gender || 'Not specified'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-gray-900">{selectedCounselor.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="flex items-center">
                      {getRoleBadge(selectedCounselor.role)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex items-center">
                      {getStatusBadge(selectedCounselor.isActive)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-900">
                  {new Date(selectedCounselor.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CounselorsManagement;

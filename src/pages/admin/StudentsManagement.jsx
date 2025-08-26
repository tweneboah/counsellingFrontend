import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiUsers,
  FiEye,
  FiEdit,
  FiToggleLeft,
  FiToggleRight,
  FiMail,
  FiPhone,
  FiBook,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiHeart,
  FiDownload,
  FiRefreshCw,
  FiPlus,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiMoreVertical,
} from "react-icons/fi";
import { Card, Button, Input, Modal, Avatar, Badge, Dropdown, Pagination } from "../../components/ui";
import AdminService from "../../services/admin.service";

const StudentCard = ({ student, onView, onEdit, onToggleStatus, index }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      await onToggleStatus(student.id || student._id, !student.isActive);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      id: "view",
      label: "View Details",
      icon: <FiEye />,
      onClick: () => onView(student),
    },
    {
      id: "edit",
      label: "Edit Student",
      icon: <FiEdit />,
      onClick: () => onEdit(student),
    },
    {
      id: "toggle",
      label: student.isActive ? "Deactivate" : "Activate",
      icon: student.isActive ? <FiToggleLeft /> : <FiToggleRight />,
      onClick: handleToggleStatus,
      loading: isLoading,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group"
    >
      <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            {/* Avatar */}
            <Avatar
              src={student.profilePicture}
              alt={student.fullName}
              initials={student.fullName?.split(" ").map(n => n[0]).join("") || "S"}
              size="md"
              className="ring-2 ring-gray-100 group-hover:ring-[#003049]/20 transition-all flex-shrink-0 sm:size-lg"
            />

            {/* Student Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {student.fullName}
                </h3>
                <Badge
                  variant={student.isActive ? "success" : "error"}
                  className={`text-xs ${student.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} self-start sm:self-auto`}
                >
                  {student.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <FiUser className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#003049] flex-shrink-0" />
                  <span className="font-medium">ID:</span>
                  <span className="ml-1 truncate">{student.studentId}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <FiMail className="w-4 h-4 mr-2 text-[#f77f00]" />
                  <span className="truncate">{student.email}</span>
                </div>

                {student.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiPhone className="w-4 h-4 mr-2 text-[#fcbf49]" />
                    <span>{student.phoneNumber}</span>
                  </div>
                )}

                {student.programmeOfStudy && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiBook className="w-4 h-4 mr-2 text-[#d62828]" />
                    <span className="truncate">{student.programmeOfStudy}</span>
                  </div>
                )}

                {student.level && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4 mr-2 text-purple-500" />
                    <span>Level {student.level}</span>
                  </div>
                )}

                {student.residentialStatus && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-2 text-green-500" />
                    <span>{student.residentialStatus}</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">Joined</div>
                </div>
                {student.lastLogin && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(student.lastLogin).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">Last Login</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Dropdown
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiMoreVertical className="w-4 h-4" />
                </Button>
              }
              items={menuItems}
              align="right"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const StudentModal = ({ student, isOpen, onClose, mode = "view", onStudentUpdated }) => {
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [formData, setFormData] = useState(student || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData(student);
      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [student]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await AdminService.updateStudent(student.id || student._id, formData);
      if (response.data && response.data.status === "success") {
        setSaveSuccess(true);
        setIsEditing(false);
        // Call parent callback to refresh data
        if (onStudentUpdated) {
          onStudentUpdated();
        }
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
          setSaveSuccess(false);
        }, 1500);
      } else {
        setSaveError("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      setSaveError(error.response?.data?.message || "Failed to update student");
    } finally {
      setIsSaving(false);
    }
  };

  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="space-y-6">
        {/* Success/Error Messages */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiCheck className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">Student updated successfully!</span>
            </div>
          </motion.div>
        )}

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 font-medium">{saveError}</span>
              </div>
              <button
                onClick={() => setSaveError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              src={student.profilePicture}
              alt={student.fullName}
              initials={student.fullName?.split(" ").map(n => n[0]).join("") || "S"}
              size="xl"
              className="ring-4 ring-[#003049]/10"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.fullName}</h2>
              <p className="text-gray-600">Student ID: {student.studentId}</p>
              <Badge
                variant={student.isActive ? "success" : "error"}
                className="mt-2"
              >
                {student.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-[#003049] to-[#d62828] text-white"
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  className="bg-gradient-to-r from-[#fcbf49] to-[#f77f00] text-white"
                >
                  <FiCheck className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiUser className="w-5 h-5 mr-2 text-[#003049]" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <Input
                    value={formData.fullName || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">{student.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{student.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <Input
                    value={formData.phoneNumber || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">{student.phoneNumber || "Not provided"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || null }))}
                  />
                ) : (
                  <p className="text-gray-900">{student.age || "Not provided"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    value={formData.gender || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{student.gender || "Not provided"}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Academic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiBook className="w-5 h-5 mr-2 text-[#d62828]" />
              Academic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Programme of Study</label>
                {isEditing ? (
                  <Input
                    value={formData.programmeOfStudy || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, programmeOfStudy: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">{student.programmeOfStudy || "Not provided"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                {isEditing ? (
                  <Input
                    value={formData.level || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-900">{student.level || "Not provided"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Status</label>
                {isEditing ? (
                  <select
                    value={formData.residentialStatus || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, residentialStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="On-Campus">On-Campus</option>
                    <option value="Off-Campus">Off-Campus</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{student.residentialStatus || "Not provided"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                {isEditing ? (
                  <select
                    value={formData.preferredLanguage || "English"}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Twi">Twi</option>
                    <option value="Ewe">Ewe</option>
                    <option value="Hausa">Hausa</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{student.preferredLanguage || "English"}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Support Information */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiHeart className="w-5 h-5 mr-2 text-[#f77f00]" />
              Support Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Counseling</label>
                <p className="text-gray-900">
                  {student.reasonForCounseling?.length > 0 
                    ? student.reasonForCounseling.join(", ") 
                    : "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Counseling</label>
                <p className="text-gray-900">
                  {student.previousCounselingHistory?.hasPreviousCounseling ? "Yes" : "No"}
                </p>
              </div>
              {student.emergencyContact && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                    <p className="text-gray-900">{student.emergencyContact.name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                    <p className="text-gray-900">{student.emergencyContact.phoneNumber || "Not provided"}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "", // active, inactive, all
    programme: "",
    level: "",
    residentialStatus: "",
    language: ""
  });
  const [isExporting, setIsExporting] = useState(false);

  const pageSize = 12;

  const fetchStudents = async (page = 1, search = "") => {
    try {
      setLoading(page === 1);
      const response = await AdminService.getAllStudents(page, pageSize, search);
      
      if (response.data && response.data.status === "success") {
        setStudents(response.data.data.students);
        setTotalPages(response.data.totalPages);
        setTotalStudents(response.data.totalStudents);
        setError(null);
      } else {
        setError("Failed to load students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents(currentPage, searchTerm);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (studentId, newStatus) => {
    try {
      await AdminService.toggleStudentStatus(studentId, newStatus);
      // Refresh the current page
      fetchStudents(currentPage, searchTerm);
    } catch (error) {
      console.error("Error toggling student status:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Get all students for export (without pagination)
      const response = await AdminService.getAllStudents(1, 1000, searchTerm);
      
      if (response.data && response.data.status === "success") {
        const studentsData = response.data.data.students;
        
        // Convert to CSV
        const headers = [
          "Full Name", "Student ID", "Email", "Phone", "Age", "Gender",
          "Programme", "Level", "Residential Status", "Language", "Status", "Joined"
        ];
        
        const csvContent = [
          headers.join(","),
          ...studentsData.map(student => [
            `"${student.fullName || ""}"`,
            `"${student.studentId || ""}"`,
            `"${student.email || ""}"`,
            `"${student.phoneNumber || ""}"`,
            student.age || "",
            `"${student.gender || ""}"`,
            `"${student.programmeOfStudy || ""}"`,
            `"${student.level || ""}"`,
            `"${student.residentialStatus || ""}"`,
            `"${student.preferredLanguage || ""}"`,
            student.isActive ? "Active" : "Inactive",
            `"${new Date(student.createdAt).toLocaleDateString()}"`
          ].join(","))
        ].join("\n");

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error("Error exporting students:", error);
      setError("Failed to export students data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      programme: "",
      level: "",
      residentialStatus: "",
      language: ""
    });
    setCurrentPage(1);
  };

  const getFilteredStudents = () => {
    let filtered = students;

    if (filters.status) {
      if (filters.status === "active") {
        filtered = filtered.filter(student => student.isActive);
      } else if (filters.status === "inactive") {
        filtered = filtered.filter(student => !student.isActive);
      }
    }

    if (filters.programme) {
      filtered = filtered.filter(student => 
        student.programmeOfStudy?.toLowerCase().includes(filters.programme.toLowerCase())
      );
    }

    if (filters.level) {
      filtered = filtered.filter(student => 
        student.level?.toLowerCase().includes(filters.level.toLowerCase())
      );
    }

    if (filters.residentialStatus) {
      filtered = filtered.filter(student => student.residentialStatus === filters.residentialStatus);
    }

    if (filters.language) {
      filtered = filtered.filter(student => student.preferredLanguage === filters.language);
    }

    return filtered;
  };

  const onStudentUpdated = () => {
    // Refresh the students list
    fetchStudents(currentPage, searchTerm);
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 sm:h-64 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003049] via-[#d62828] to-[#f77f00] text-white">
        <div className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
          >
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center">
                <FiUsers className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="truncate">Students Management</span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p className="text-white/90 text-sm sm:text-base">
                  Manage and monitor student accounts
                </p>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 self-start sm:self-auto">
                  {totalStudents} Total Students
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                onClick={handleRefresh}
                loading={refreshing}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm sm:text-base"
                size="sm"
              >
                <FiRefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                onClick={handleExport}
                loading={isExporting}
                className="bg-gradient-to-r from-[#fcbf49] to-[#f77f00] text-white text-sm sm:text-base"
                size="sm"
              >
                <FiDownload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Search students by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9 sm:pl-10 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button 
                  variant="outline" 
                  className="flex items-center text-sm sm:text-base"
                  onClick={() => setShowFilters(!showFilters)}
                  size="sm"
                >
                  <FiFilter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  <span className="sm:hidden">Filter</span>
                  {Object.values(filters).some(v => v) && (
                    <Badge className="ml-1 sm:ml-2 bg-[#d62828] text-white text-xs">
                      {Object.values(filters).filter(v => v).length}
                    </Badge>
                  )}
                </Button>
                {Object.values(filters).some(v => v) && (
                  <Button 
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-[#d62828] hover:text-[#d62828] text-sm sm:text-base"
                    size="sm"
                  >
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filter Students</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <Input
                      placeholder="Filter by programme..."
                      value={filters.programme}
                      onChange={(e) => handleFilterChange("programme", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <Input
                      placeholder="Filter by level..."
                      value={filters.level}
                      onChange={(e) => handleFilterChange("level", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Residential Status</label>
                    <select
                      value={filters.residentialStatus}
                      onChange={(e) => handleFilterChange("residentialStatus", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent"
                    >
                      <option value="">All Residential</option>
                      <option value="On-Campus">On-Campus</option>
                      <option value="Off-Campus">Off-Campus</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={filters.language}
                      onChange={(e) => handleFilterChange("language", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003049] focus:border-transparent"
                    >
                      <option value="">All Languages</option>
                      <option value="English">English</option>
                      <option value="Twi">Twi</option>
                      <option value="Ewe">Ewe</option>
                      <option value="Hausa">Hausa</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 font-medium">Error loading students</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </Card>
          </motion.div>
        )}

        {/* Students Grid */}
        {(() => {
          const filteredStudents = getFilteredStudents();
          return filteredStudents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {filteredStudents.map((student, index) => (
                <StudentCard
                  key={student.id || student._id}
                  student={student}
                  index={index}
                  onView={handleViewStudent}
                  onEdit={handleEditStudent}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <Card className="p-6 sm:p-12 max-w-md mx-auto">
                <FiUsers className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  {searchTerm 
                    ? `No students match "${searchTerm}"`
                    : "No students have been registered yet"}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => handleSearch("")}
                    variant="outline"
                    size="sm"
                  >
                    Clear search
                  </Button>
                )}
              </Card>
            </motion.div>
          );
        })()}
      </div>

      {/* Student Modal */}
      <StudentModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onStudentUpdated={onStudentUpdated}
      />
    </div>
  );
};

export default StudentsManagement;
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";
import { Card, Badge, Input, Button, Dropdown, Avatar, Skeleton } from "../ui";
import CounselorService from "../../services/counselor.service";

/**
 * StudentList component for counselors to manage and view students
 *
 * @param {Object} props
 * @param {function} props.onSelectStudent - Callback when a student is selected
 */
const StudentList = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    flagged: false,
    programme: "",
    level: "",
  });
  const [sortBy, setSortBy] = useState("lastActivity");

  // Filter options
  const programmes = [
    "All Programmes",
    "Computer Science",
    "Business Administration",
    "Psychology",
    "Law",
    "Engineering",
    "Medicine",
  ];

  const levels = [
    "All Levels",
    "100 Level",
    "200 Level",
    "300 Level",
    "400 Level",
    "Postgraduate",
  ];

  const sortOptions = [
    { id: "lastActivity", label: "Last Activity" },
    { id: "name", label: "Name" },
    { id: "interactions", label: "Interaction Count" },
    { id: "flaggedStatus", label: "Risk Level" },
  ];

  useEffect(() => {
    loadStudents();
  }, [filters, sortBy]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      // Build query parameters from filters
      const params = new URLSearchParams();
      if (filters.flagged) params.append("flagged", "true");
      if (filters.programme && filters.programme !== "All Programmes")
        params.append("programme", filters.programme);
      if (filters.level && filters.level !== "All Levels")
        params.append("level", filters.level);
      params.append("sortBy", sortBy);
      params.append("search", searchTerm);

      const response = await CounselorService.getStudents(params);

      if (response.data.success) {
        setStudents(response.data.students || []);
      } else {
        setError(response.data.message || "Failed to load students");
      }
    } catch (error) {
      console.error("Error loading students:", error);
      setError("An error occurred while loading the student list");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadStudents();
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
    loadStudents();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleFlaggedFilter = () => {
    setFilters((prev) => ({
      ...prev,
      flagged: !prev.flagged,
    }));
  };

  const resetFilters = () => {
    setFilters({
      flagged: false,
      programme: "",
      level: "",
    });
    setSearchTerm("");
  };

  const getStudentRiskBadge = (riskLevel) => {
    if (!riskLevel) return null;

    const badges = {
      high: <Badge variant="error">High Risk</Badge>,
      medium: <Badge variant="warning">Medium Risk</Badge>,
      low: <Badge variant="success">Low Risk</Badge>,
      none: <Badge variant="default">No Risk</Badge>,
    };

    return badges[riskLevel.toLowerCase()] || badges.none;
  };

  // Format date relative to now (e.g., "2 days ago", "Just now")
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Students</h2>

        {/* Search and filter toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            {searchTerm ? (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FiX size={18} />
              </button>
            ) : (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleSearch}
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={filters.flagged ? "primary" : "outline"}
              onClick={toggleFlaggedFilter}
              className="whitespace-nowrap"
            >
              <FiAlertTriangle
                className={`mr-1 ${
                  filters.flagged ? "text-white" : "text-red-500"
                }`}
              />
              At Risk
            </Button>

            <Dropdown
              trigger={
                <Button variant="outline" className="whitespace-nowrap">
                  <FiFilter className="mr-1" />
                  Filters
                </Button>
              }
              width="md"
              items={[
                {
                  id: "program-filter",
                  label: "Program",
                  divider: true,
                },
                ...programmes.map((programme) => ({
                  id: `programme-${programme}`,
                  label: programme,
                  onClick: () => handleFilterChange("programme", programme),
                })),
                {
                  id: "level-filter",
                  label: "Level",
                  divider: true,
                },
                ...levels.map((level) => ({
                  id: `level-${level}`,
                  label: level,
                  onClick: () => handleFilterChange("level", level),
                })),
                {
                  id: "reset",
                  label: "Reset All Filters",
                  onClick: resetFilters,
                  divider: true,
                },
              ]}
            />

            <Dropdown
              trigger={
                <Button variant="outline" className="whitespace-nowrap">
                  Sort By
                </Button>
              }
              items={sortOptions.map((option) => ({
                id: option.id,
                label: option.label,
                onClick: () => setSortBy(option.id),
              }))}
            />
          </div>
        </div>

        {/* Applied filters */}
        {(filters.flagged || filters.programme || filters.level) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.flagged && (
              <Badge variant="primary" className="flex items-center gap-1">
                At Risk{" "}
                <FiX className="cursor-pointer" onClick={toggleFlaggedFilter} />
              </Badge>
            )}
            {filters.programme && filters.programme !== "All Programmes" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.programme}{" "}
                <FiX
                  className="cursor-pointer"
                  onClick={() => handleFilterChange("programme", "")}
                />
              </Badge>
            )}
            {filters.level && filters.level !== "All Levels" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.level}{" "}
                <FiX
                  className="cursor-pointer"
                  onClick={() => handleFilterChange("level", "")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Student list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center p-3 border-b border-gray-100"
              >
                <Skeleton
                  type="avatar"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <div className="flex-1">
                  <Skeleton type="text" width="40%" className="mb-2" />
                  <Skeleton type="text" width="30%" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : students.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm || filters.flagged || filters.programme || filters.level
              ? "No students match the current filters"
              : "No students available"}
          </div>
        ) : (
          <div>
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectStudent(student)}
              >
                <Avatar
                  src={student.profilePicture}
                  alt={student.fullName}
                  size="md"
                  status={student.lastActivity ? "online" : "offline"}
                  className="mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {student.fullName}
                    </h3>
                    {getStudentRiskBadge(student.riskLevel)}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 mt-1">
                    <span className="truncate">
                      {student.programme} • {student.level}
                    </span>
                    <span className="hidden sm:inline mx-1">•</span>
                    <span>
                      {student.lastActivity
                        ? `Last active ${formatRelativeTime(
                            student.lastActivity
                          )}`
                        : "Never logged in"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudentList;

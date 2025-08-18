import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiCalendar,
  FiFlag,
  FiDownload,
  FiPhone,
  FiMail,
  FiEdit,
  FiBarChart2,
} from "react-icons/fi";
import { Card, Tabs, Badge, Button, Avatar, Skeleton } from "../ui";
import CounselorService from "../../services/counselor.service";

/**
 * StudentProfile component for counselors to view detailed student information
 *
 * @param {Object} props
 * @param {string} props.studentId - ID of the student to display
 * @param {function} props.onBack - Callback when back button is clicked
 */
const StudentProfile = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      loadStudentProfile(studentId);
    }
  }, [studentId]);

  const loadStudentProfile = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await CounselorService.getStudentById(id);

      if (response.data.success) {
        setStudent(response.data.student);
      } else {
        setError(response.data.message || "Failed to load student profile");
      }
    } catch (error) {
      console.error("Error loading student profile:", error);
      setError("An error occurred while loading the student profile");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    navigate(`/counselor/chats/${studentId}`);
  };

  const handleScheduleSession = () => {
    navigate(`/counselor/appointments/schedule/${studentId}`);
  };

  const handleFlagStudent = async (status) => {
    try {
      const response = await CounselorService.flagStudent(studentId, {
        flagged: status,
        reason: status ? "Counselor flagged as requiring attention" : "",
      });

      if (response.data.success) {
        // Update local state to reflect the change
        setStudent((prev) => ({
          ...prev,
          riskLevel: status ? "high" : "none",
        }));
      }
    } catch (error) {
      console.error("Error flagging student:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get appropriate risk badge
  const getRiskBadge = (riskLevel) => {
    if (!riskLevel) return null;

    const badges = {
      high: <Badge variant="error">High Risk</Badge>,
      medium: <Badge variant="warning">Medium Risk</Badge>,
      low: <Badge variant="success">Low Risk</Badge>,
      none: <Badge variant="default">No Risk</Badge>,
    };

    return badges[riskLevel.toLowerCase()] || badges.none;
  };

  // Student info tab content
  const renderInfoTab = () => {
    if (!student) return null;

    const infoSections = [
      {
        title: "Personal Information",
        items: [
          { label: "Full Name", value: student.fullName },
          { label: "Student ID", value: student.studentId },
          {
            label: "Gender",
            value: student.gender || "Not specified",
          },
          {
            label: "Date of Birth",
            value: student.dateOfBirth
              ? formatDate(student.dateOfBirth)
              : "Not specified",
          },
        ],
      },
      {
        title: "Academic Information",
        items: [
          { label: "Program", value: student.programme },
          { label: "Level", value: student.level },
        ],
      },
      {
        title: "Contact Information",
        items: [
          { label: "Email", value: student.email },
          { label: "Phone", value: student.phoneNumber || "Not provided" },
          {
            label: "Residential Status",
            value: student.residentialStatus || "Not specified",
          },
        ],
      },
    ];

    return (
      <div className="space-y-6">
        {infoSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {section.title}
            </h3>
            <div className="bg-gray-50 rounded-md p-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.label} className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Interaction history tab content
  const renderInteractionsTab = () => {
    if (!student || !student.interactions)
      return <div>No interaction data available</div>;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Counseling History
        </h3>

        {student.interactions.length === 0 ? (
          <p className="text-gray-500">
            No previous counseling sessions found.
          </p>
        ) : (
          <div className="space-y-4">
            {student.interactions.map((interaction) => (
              <Card key={interaction.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {interaction.type === "chat"
                        ? "AI Counseling Session"
                        : "In-Person Appointment"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(interaction.date)}
                      {interaction.counselor &&
                        ` with ${interaction.counselor}`}
                    </p>
                  </div>
                  <Badge
                    variant={interaction.type === "chat" ? "info" : "secondary"}
                  >
                    {interaction.type === "chat" ? "Chat" : "Appointment"}
                  </Badge>
                </div>
                {interaction.summary && (
                  <p className="mt-2 text-sm text-gray-600">
                    {interaction.summary}
                  </p>
                )}
                {interaction.type === "chat" && interaction.chatId && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/counselor/chats/${interaction.chatId}`)
                      }
                    >
                      <FiMessageCircle className="mr-2" />
                      View Conversation
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Analytics tab content
  const renderAnalyticsTab = () => {
    if (!student || !student.analytics)
      return <div>No analytics data available</div>;

    const { analytics } = student;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Engagement Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Chat Sessions</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {analytics.totalChatSessions || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Appointments</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {analytics.totalAppointments || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {analytics.lastLogin ? formatDate(analytics.lastLogin) : "Never"}
            </p>
          </Card>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Common Topics
        </h3>

        {analytics.topics && analytics.topics.length > 0 ? (
          <div className="bg-gray-50 rounded-md p-4">
            <div className="flex flex-wrap gap-2">
              {analytics.topics.map((topic) => (
                <Badge key={topic} variant="default">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No topics data available</p>
        )}

        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Mood Tracking
        </h3>

        {analytics.moods && analytics.moods.length > 0 ? (
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-sm text-gray-600 mb-2">
              Most recent moods reported by the student:
            </p>
            <div className="flex flex-wrap gap-2">
              {analytics.moods.map((mood, index) => (
                <Badge
                  key={index}
                  variant={
                    mood.includes("Happy") || mood.includes("Calm")
                      ? "success"
                      : mood.includes("Sad") ||
                        mood.includes("Angry") ||
                        mood.includes("Anxious")
                      ? "error"
                      : "info"
                  }
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No mood data available</p>
        )}
      </div>
    );
  };

  // Notes tab content (for counselor notes about the student)
  const renderNotesTab = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Counselor Notes
        </h3>
        <p className="text-gray-500 italic">
          Notes feature coming soon. This will allow counselors to save private
          notes about student interactions and concerns.
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="h-full">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-2"
            aria-label="Back"
          >
            <FiArrowLeft />
          </Button>
          <Skeleton type="text" width="40%" />
        </div>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton type="avatar" width={64} height={64} className="mr-4" />
            <div>
              <Skeleton type="text" width="60%" className="mb-2" />
              <Skeleton type="text" width="40%" />
            </div>
          </div>
          <Skeleton type="rectangle" height={200} className="mb-6" />
          <Skeleton type="text" count={3} className="mb-2" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-2"
            aria-label="Back"
          >
            <FiArrowLeft />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">
            Student Profile
          </h2>
        </div>
        <div className="p-6 text-center text-red-500">{error}</div>
      </Card>
    );
  }

  if (!student) {
    return (
      <Card className="h-full">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-2"
            aria-label="Back"
          >
            <FiArrowLeft />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">
            Student Profile
          </h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          No student data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-2"
          aria-label="Back"
        >
          <FiArrowLeft />
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">Student Profile</h2>
      </div>

      {/* Student header with key info and actions */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <Avatar
            src={student.profilePicture}
            alt={student.fullName}
            size="xl"
            className="mr-6 mb-4 sm:mb-0"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {student.fullName}
                </h1>
                <div className="flex items-center mt-1 mb-2">
                  <span className="text-sm text-gray-500 mr-2">
                    {student.studentId} • {student.programme} • {student.level}
                  </span>
                  {getRiskBadge(student.riskLevel)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="primary"
                onClick={handleStartChat}
                className="flex items-center"
              >
                <FiMessageCircle className="mr-2" />
                Start Chat
              </Button>
              <Button
                variant="outline"
                onClick={handleScheduleSession}
                className="flex items-center"
              >
                <FiCalendar className="mr-2" />
                Schedule Appointment
              </Button>
              {student.riskLevel === "high" ? (
                <Button
                  variant="outline"
                  onClick={() => handleFlagStudent(false)}
                  className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                >
                  <FiFlag className="mr-2" />
                  Remove Flag
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleFlagStudent(true)}
                  className="flex items-center"
                >
                  <FiFlag className="mr-2" />
                  Flag for Attention
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs with student details */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs
          tabs={[
            {
              id: "info",
              label: "Personal Info",
              content: renderInfoTab(),
            },
            {
              id: "interactions",
              label: "Interactions",
              content: renderInteractionsTab(),
            },
            {
              id: "analytics",
              label: "Analytics",
              content: renderAnalyticsTab(),
            },
            {
              id: "notes",
              label: "Counselor Notes",
              content: renderNotesTab(),
            },
          ]}
        />
      </div>
    </Card>
  );
};

export default StudentProfile;

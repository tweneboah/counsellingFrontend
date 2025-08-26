import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiCalendar,
  FiLock,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { Button, Card, Avatar, Input, Select, Badge } from "../../components/ui";
import api from "../../services/api";

const AdminProfile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/user/profile");

      if (response.data.status === "success") {
        setProfileData(response.data.data.user);
        setFormData(response.data.data.user);
      } else {
        setError("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("An error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await api.patch("/user/profile", formData);

      if (response.data.status === "success") {
        setProfileData(response.data.data.user);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await api.patch("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.status === "success") {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        setSuccess("Password updated successfully!");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Current password is incorrect or an error occurred");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData(profileData);
    setIsEditing(false);
    setError("");
  };

  const cancelPasswordEdit = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
    setError("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "counselor":
        return "bg-blue-100 text-blue-800";
      case "moderator":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return "👑";
      case "counselor":
        return "🧑‍⚕️";
      case "moderator":
        return "🛡️";
      default:
        return "👤";
    }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-24 sm:h-32 bg-gray-200 rounded-2xl mb-4 sm:mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="h-80 sm:h-96 bg-gray-200 rounded-2xl"></div>
              <div className="lg:col-span-2 h-80 sm:h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003049] to-[#0056b3] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate">Profile Settings</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Manage your account information and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isEditing && !showPasswordForm ? (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2"
                >
                  <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={isEditing ? cancelEdit : cancelPasswordEdit}
                    className="flex items-center space-x-1 sm:space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm sm:text-base px-3 sm:px-4 py-2"
                  >
                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                    <span className="sm:hidden">Cancel</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={isEditing ? handleSubmit : handlePasswordSubmit}
                    disabled={loading}
                    className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2"
                  >
                    <FiSave className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
          >
            <FiAlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
          >
            <FiCheck className="w-5 h-5 mr-2" />
            {success}
          </motion.div>
        )}

        {profileData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 sm:p-8 bg-white shadow-sm border-0">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 sm:mb-6">
                    <Avatar
                      size="2xl"
                      src={profileData.profilePicture}
                      alt={profileData.fullName}
                      className="ring-4 ring-[#003049]/10"
                    />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate max-w-full">
                    {profileData.fullName}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{profileData.staffId}</p>

                  <div className="flex items-center space-x-2 mb-6">
                    <Badge className={`${getRoleColor(profileData.role)} px-3 py-1`}>
                      <span className="mr-1">{getRoleIcon(profileData.role)}</span>
                      {profileData.role?.charAt(0).toUpperCase() + profileData.role?.slice(1)}
                    </Badge>
                    {profileData.isActive && (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="w-full space-y-3 sm:space-y-4">
                    <div className="flex items-start text-gray-600">
                      <FiMail className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm break-all">{profileData.email}</span>
                    </div>
                    {profileData.phoneNumber && (
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{profileData.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-start text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{profileData.department}</span>
                    </div>
                    {profileData.lastLogin && (
                      <div className="flex items-start text-gray-600">
                        <FiCalendar className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          Last login: {formatDate(profileData.lastLogin)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordForm(true)}
                      disabled={isEditing}
                      className="w-full flex items-center justify-center space-x-2 text-sm sm:text-base py-2 sm:py-3"
                    >
                      <FiLock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Change Password</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Personal Information */}
              <Card className="p-8 bg-white shadow-sm border-0">
                <div className="flex items-center mb-6">
                  <FiUser className="w-5 h-5 text-[#003049] mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profileData.fullName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Staff ID
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profileData.staffId}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profileData.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profileData.phoneNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Gender
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profileData.gender || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Department
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profileData.department}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          name="fullName"
                          value={formData.fullName || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Staff ID
                        </label>
                        <Input
                          type="text"
                          name="staffId"
                          value={formData.staffId || ""}
                          onChange={handleInputChange}
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Staff ID cannot be changed
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber || ""}
                          onChange={handleInputChange}
                          placeholder="+233 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <Select
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <Input
                          type="text"
                          name="department"
                          value={formData.department || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </form>
                )}
              </Card>

              {/* Permissions */}
              <Card className="p-8 bg-white shadow-sm border-0">
                <div className="flex items-center mb-6">
                  <FiShield className="w-5 h-5 text-[#003049] mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Permissions & Access
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.permissions && Object.entries(profileData.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge className={value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {value ? "Granted" : "Denied"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Password Change Form */}
              {showPasswordForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-8 bg-white shadow-sm border-0">
                    <div className="flex items-center mb-6">
                      <FiLock className="w-5 h-5 text-[#003049] mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Change Password
                      </h3>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <Input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <Input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Must be at least 8 characters long
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                        />
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
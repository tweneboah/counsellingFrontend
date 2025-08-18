import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StudentService from "../../services/student.service";
import { Button, Card, Avatar } from "../../components/ui";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

const Profile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await StudentService.getProfile();

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

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await StudentService.updateProfile(formData);

      if (response.data.status === "success") {
        setProfileData(response.data.data.user);
        setIsEditing(false);
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

  const cancelEdit = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (loading && !profileData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center"
          >
            <FiEdit2 className="mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={cancelEdit}
              className="flex items-center"
            >
              <FiX className="mr-2" />
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="flex items-center"
              disabled={loading}
            >
              <FiSave className="mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {profileData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="md:col-span-1 p-6">
            <div className="flex flex-col items-center">
              <Avatar
                size="xl"
                src={profileData.profilePicture}
                alt={profileData.fullName}
                className="mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {profileData.fullName}
              </h2>
              <p className="text-gray-600 mb-4">{profileData.studentId}</p>

              {!isEditing ? (
                <div className="w-full space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">
                      {profileData.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">
                      {profileData.gender || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {profileData.dateOfBirth
                        ? new Date(profileData.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              ) : (
                <form className="w-full space-y-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={
                        formData.dateOfBirth
                          ? new Date(formData.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </form>
              )}
            </div>
          </Card>

          {/* Academic Details */}
          <Card className="md:col-span-2 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Academic Details
            </h2>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Programme of Study</p>
                    <p className="font-medium">
                      {profileData.programmeOfStudy || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-medium">
                      {profileData.level || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Residential Status</p>
                    <p className="font-medium">
                      {profileData.residentialStatus || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preferred Language</p>
                    <p className="font-medium">
                      {profileData.preferredLanguage || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  {profileData.emergencyContact ? (
                    <div className="mt-2">
                      <p className="font-medium">
                        {profileData.emergencyContact.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {profileData.emergencyContact.relationship} •{" "}
                        {profileData.emergencyContact.phoneNumber}
                      </p>
                    </div>
                  ) : (
                    <p className="font-medium">Not provided</p>
                  )}
                </div>
              </div>
            ) : (
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Programme of Study
                    </label>
                    <input
                      type="text"
                      name="programmeOfStudy"
                      value={formData.programmeOfStudy || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Level
                    </label>
                    <input
                      type="text"
                      name="level"
                      value={formData.level || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Residential Status
                    </label>
                    <select
                      name="residentialStatus"
                      value={formData.residentialStatus || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Status</option>
                      <option value="On-Campus">On-Campus</option>
                      <option value="Off-Campus">Off-Campus</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Preferred Language
                    </label>
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Twi">Twi</option>
                      <option value="Ewe">Ewe</option>
                      <option value="Hausa">Hausa</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact?.name || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            emergencyContact: {
                              ...prev.emergencyContact,
                              name: e.target.value,
                            },
                          }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact?.relationship || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            emergencyContact: {
                              ...prev.emergencyContact,
                              relationship: e.target.value,
                            },
                          }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact.phoneNumber"
                        value={formData.emergencyContact?.phoneNumber || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            emergencyContact: {
                              ...prev.emergencyContact,
                              phoneNumber: e.target.value,
                            },
                          }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;

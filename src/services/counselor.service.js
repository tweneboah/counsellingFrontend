import api from "./api";

const CounselorService = {
  // Get all counselors
  getCounselors: async (page = 1, limit = 50) => {
    const params = { page, limit };
    return await api.get("/admin/counselors", { params });
  },

  // Get available counselors for appointments (public endpoint for students)
  getAvailableCounselors: async (page = 1, limit = 50) => {
    const params = { page, limit };
    return await api.get("/appointments/available-counselors", { params });
  },

  // Get a specific counselor by ID
  getCounselorById: async (counselorId) => {
    return await api.get(`/admin/counselors/${counselorId}`);
  },

  // Get a specific student by ID
  getStudentById: async (studentId) => {
    return await api.get(`/admin/students/${studentId}`);
  },

  // Get all students
  getStudents: async (page = 1, limit = 50) => {
    const params = { page, limit };
    return await api.get("/admin/students", { params });
  },

  // Create an appointment (counselor perspective)
  createAppointment: async (appointmentData) => {
    return await api.post("/appointments", appointmentData);
  },

  // Update counselor profile
  updateProfile: async (profileData) => {
    return await api.patch("/users/counselors/profile", profileData);
  },

  // Update counselor availability
  updateAvailability: async (availabilityData) => {
    return await api.patch("/users/counselors/availability", availabilityData);
  },
};

export default CounselorService;

import api from "./api";

const AdminService = {
  // Dashboard analytics
  getDashboardAnalytics: async () => {
    return await api.get("/admin/dashboard");
  },

  // Student management
  getAllStudents: async (page = 1, limit = 10, search) => {
    const params = { page, limit };
    if (search) {
      params.search = search;
    }
    return await api.get("/admin/students", { params });
  },

  getStudentById: async (studentId) => {
    return await api.get(`/admin/students/${studentId}`);
  },

  updateStudent: async (studentId, studentData) => {
    return await api.patch(`/admin/students/${studentId}`, studentData);
  },

  toggleStudentStatus: async (studentId, isActive) => {
    return await api.patch(`/admin/students/${studentId}/status`, { isActive });
  },

  // Counselor management
  getAllCounselors: async (page = 1, limit = 10, search) => {
    const params = { page, limit };
    if (search) {
      params.search = search;
    }
    return await api.get("/admin/counselors", { params });
  },

  updateCounselor: async (counselorId, counselorData) => {
    return await api.patch(`/admin/counselors/${counselorId}`, counselorData);
  },

  toggleCounselorStatus: async (counselorId, isActive) => {
    return await api.patch(`/admin/counselors/${counselorId}/status`, {
      isActive,
    });
  },



  // Counselor registration (admin only)
  registerCounselor: async (counselorData) => {
    return await api.post("/auth/register/counselor", counselorData);
  },

  // Admin registration with special code
  registerAdmin: async (adminData, adminCode) => {
    return await api.post("/auth/register/admin", {
      ...adminData,
      adminCode,
    });
  },

  // Chat sessions management
  getChatSessions: async (page = 1, limit = 10, search, status) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (status) params.status = status;

    return await api.get("/admin/chat-sessions", { params });
  },

  getChatHistory: async (sessionId) => {
    return await api.get(`/admin/chat-sessions/${sessionId}/history`);
  },



  // Journal management
  getAllJournals: async (page = 1, limit = 10, search) => {
    const params = { page, limit };
    if (search) params.search = search;
    return await api.get("/admin/journals", { params });
  },

  // Warning management
  getStudentWarnings: async (studentId, page = 1, limit = 10) => {
    return await api.get(`/admin/students/${studentId}/warnings`, {
      params: { page, limit },
    });
  },

  getWarningStats: async () => {
    return await api.get("/admin/warnings/stats");
  },

  exportChatHistory: async (sessionId, format = "text") => {
    return await api.get(`/admin/chat-sessions/${sessionId}/export`, {
      params: { format },
      responseType: "blob",
    });
  },
};

export default AdminService;

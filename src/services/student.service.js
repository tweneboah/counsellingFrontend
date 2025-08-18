import api from "./api";

const StudentService = {
  // Get dashboard data for student
  getDashboardData: async () => {
    try {
      const response = await api.get("/user/dashboard");
      return {
        data: {
          success: true,
          data: response.data.data,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  // Update student profile
  updateProfile: async (profileData) => {
    return await api.patch("/user/profile", profileData);
  },

  // Get student profile
  getProfile: async () => {
    return await api.get("/user/profile");
  },

  // Update notification preferences (TODO: implement backend endpoint)
  updateNotificationPreferences: async (preferences) => {
    return await api.put("/students/notifications/preferences", preferences);
  },

  // Get notification preferences (TODO: implement backend endpoint)
  getNotificationPreferences: async () => {
    return await api.get("/students/notifications/preferences");
  },

  // Get notifications (TODO: implement backend endpoint)
  getNotifications: async (page = 1, limit = 10) => {
    return await api.get(`/students/notifications?page=${page}&limit=${limit}`);
  },

  // Mark notification as read (TODO: implement backend endpoint)
  markNotificationRead: async (notificationId) => {
    return await api.put(`/students/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read (TODO: implement backend endpoint)
  markAllNotificationsRead: async () => {
    return await api.put("/students/notifications/read-all");
  },

  // Warning-related methods
  getMyWarnings: async (page = 1, limit = 10) => {
    return await api.get("/students/warnings", {
      params: { page, limit },
    });
  },

  acknowledgeWarning: async (warningId) => {
    return await api.patch(`/students/warnings/${warningId}/acknowledge`);
  },
};

export default StudentService;

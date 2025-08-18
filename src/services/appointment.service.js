import api from "./api";

const AppointmentService = {
  // Create a new appointment
  createAppointment: async (appointmentData) => {
    return await api.post("/appointments", appointmentData);
  },

  // Get student's appointments
  getStudentAppointments: async (page = 1, limit = 10, status) => {
    const params = { page, limit };
    if (status) {
      params.status = status;
    }
    return await api.get("/appointments/student", { params });
  },

  // Get counselor's appointments
  getCounselorAppointments: async (page = 1, limit = 10, status, date) => {
    const params = { page, limit };
    if (status) {
      params.status = status;
    }
    if (date) {
      params.date = date;
    }
    return await api.get("/appointments/counselor", { params });
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    return await api.get(`/appointments/${appointmentId}`);
  },

  // Update appointment
  updateAppointment: async (appointmentId, appointmentData) => {
    return await api.patch(`/appointments/${appointmentId}`, appointmentData);
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    return await api.patch(`/appointments/${appointmentId}/cancel`);
  },

  // Get available time slots for a counselor
  getCounselorTimeSlots: async (counselorId, date) => {
    if (!counselorId || !date) {
      throw new Error("Both counselorId and date are required");
    }

    // Ensure date is in the correct format (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split("T")[0];

    return await api.get(`/appointments/counselor/${counselorId}/timeslots`, {
      params: { date: formattedDate },
    });
  },

  // Get list of available counselors for appointments
  getAvailableCounselors: async (page = 1, limit = 50) => {
    const params = { page, limit };
    return await api.get("/appointments/available-counselors", { params });
  },
};

export default AppointmentService;

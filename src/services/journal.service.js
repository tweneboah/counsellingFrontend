import api from "./api";

const JournalService = {
  // Get all journal entries
  getJournalEntries: async (page = 1, limit = 10, mood = null) => {
    try {
      const params = { page, limit };
      if (mood) params.mood = mood;
      return await api.get("/counseling/journals", { params });
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      throw error;
    }
  },

  // Get a single journal entry by ID
  getJournalEntry: async (entryId) => {
    try {
      return await api.get(`/counseling/journals/${entryId}`);
    } catch (error) {
      console.error(`Error fetching journal entry ${entryId}:`, error);
      throw error;
    }
  },

  // Create a new journal entry
  createJournalEntry: async (journalData) => {
    try {
      return await api.post("/counseling/journal", journalData);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      throw error;
    }
  },

  // Update an existing journal entry
  updateJournalEntry: async (entryId, journalData) => {
    try {
      return await api.patch(`/counseling/journals/${entryId}`, journalData);
    } catch (error) {
      console.error(`Error updating journal entry ${entryId}:`, error);
      throw error;
    }
  },

  // Delete a journal entry
  deleteJournalEntry: async (entryId) => {
    try {
      return await api.delete(`/counseling/journals/${entryId}`);
    } catch (error) {
      console.error(`Error deleting journal entry ${entryId}:`, error);
      throw error;
    }
  },

  // Get mood statistics
  getMoodStatistics: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Note: This endpoint may need to be implemented on the backend
      // For now, keeping it commented out until backend support is added
      // return await api.get("/counseling/mood-statistics", { params });

      // Mock response until backend endpoint is implemented
      return {
        data: {
          success: true,
          data: {
            moodCounts: {
              Happy: 8,
              Calm: 5,
              Anxious: 4,
              Sad: 2,
              Angry: 1,
            },
            moodTimeline: [
              { date: new Date(Date.now() - 86400000 * 30), mood: "Calm" },
              { date: new Date(Date.now() - 86400000 * 25), mood: "Happy" },
              { date: new Date(Date.now() - 86400000 * 20), mood: "Anxious" },
              { date: new Date(Date.now() - 86400000 * 15), mood: "Sad" },
              { date: new Date(Date.now() - 86400000 * 10), mood: "Happy" },
              { date: new Date(Date.now() - 86400000 * 5), mood: "Calm" },
              { date: new Date(Date.now() - 86400000), mood: "Happy" },
            ],
          },
        },
      };
    } catch (error) {
      console.error("Error fetching mood statistics:", error);
      throw error;
    }
  },
};

export default JournalService;

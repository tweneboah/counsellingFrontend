import api from "./api";

const CounselingService = {
  // AI Chat related functions
  sendChatMessage: async (message, chatId = null) => {
    // Handle both simple message string and complex object with preferences
    if (typeof message === "object" && message.text) {
      const payload = {
        message: message.text,
        chatId,
        preferences: message.preferences,
      };

      // Add systemPrompt for first-time interactions
      if (message.systemPrompt && message.isFirstInteraction) {
        payload.systemPrompt = message.systemPrompt;
        payload.isFirstInteraction = true;
      }

      return await api.post("/counseling/chat", payload);
    } else {
      // Original behavior for string messages
      return await api.post("/counseling/chat", { message, chatId });
    }
  },

  getChatSessions: async (page = 1, limit = 10, isActive) => {
    const params = { page, limit };
    if (isActive !== undefined) {
      params.isActive = isActive;
    }
    return await api.get("/counseling/chats", { params });
  },

  getChatById: async (chatId) => {
    return await api.get(`/counseling/chats/${chatId}`);
  },

  endChatSession: async (chatId, feedback, moodRating) => {
    return await api.patch(`/counseling/chats/${chatId}/end`, {
      feedback,
      moodRating,
    });
  },

  // Journal related functions
  createJournalEntry: async (journalData) => {
    return await api.post("/counseling/journal", journalData);
  },

  getJournalEntries: async (page = 1, limit = 10, mood) => {
    const params = { page, limit };
    if (mood) {
      params.mood = mood;
    }
    return await api.get("/counseling/journals", { params });
  },

  getJournalById: async (journalId) => {
    return await api.get(`/counseling/journals/${journalId}`);
  },

  updateJournalEntry: async (journalId, journalData) => {
    return await api.patch(`/counseling/journals/${journalId}`, journalData);
  },

  deleteJournalEntry: async (journalId) => {
    return await api.delete(`/counseling/journals/${journalId}`);
  },
};

export default CounselingService;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiSave,
  FiArrowLeft,
  FiTrash2,
  FiEdit2,
  FiHeart,
  FiLock,
  FiUnlock,
  FiStar,
  FiFeather,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, TextArea, IconButton, SuccessModal, ConfirmationModal } from "../ui";
import JournalService from "../../services/journal.service";

const JournalEditor = ({
  existingEntry,
  onSave,
  onCancel,
  isEditing: initialEditingState,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(
    initialEditingState !== undefined ? initialEditingState : true
  );
  const [notFound, setNotFound] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const navigate = useNavigate();
  const { entryId } = useParams();

  // Enhanced mood options with better styling and emojis
  const moodOptions = [
    { emoji: "😊", text: "Happy", color: "from-green-400 to-emerald-500" },
    { emoji: "😌", text: "Calm", color: "from-blue-400 to-cyan-500" },
    { emoji: "😐", text: "Neutral", color: "from-gray-400 to-slate-500" },
    { emoji: "😢", text: "Sad", color: "from-blue-500 to-indigo-600" },
    { emoji: "😠", text: "Angry", color: "from-red-500 to-rose-600" },
    { emoji: "😰", text: "Anxious", color: "from-yellow-500 to-amber-600" },
    { emoji: "😴", text: "Tired", color: "from-purple-400 to-violet-500" },
    { emoji: "🤔", text: "Confused", color: "from-orange-400 to-amber-500" },
    { emoji: "🥳", text: "Excited", color: "from-pink-400 to-rose-500" },
  ];

  useEffect(() => {
    if (existingEntry) {
      // If editing an existing entry, populate the form
      setTitle(existingEntry.title || "");
      setContent(existingEntry.content || "");
      setMood(existingEntry.mood || "");
      setIsPrivate(existingEntry.isPrivate !== false);
      setIsEditing(
        initialEditingState !== undefined ? initialEditingState : false
      ); // Use prop or default to view mode
    } else if (entryId) {
      // If entry ID is provided in URL but no existingEntry prop, fetch the entry
      loadJournalEntry(entryId);
    }
  }, [existingEntry, entryId, initialEditingState]);

  const loadJournalEntry = async (id) => {
    try {
      setLoading(true);
      const response = await JournalService.getJournalEntry(id);

      if (response.data.status === "success") {
        const entry = response.data.data.journal;
        setTitle(entry.title || "");
        setContent(entry.content || "");
        setMood(entry.mood || "");
        setIsPrivate(entry.isPrivate !== false);
        setIsEditing(
          initialEditingState !== undefined ? initialEditingState : false
        ); // Use prop or default to view mode
      } else {
        setError("Failed to load journal entry");
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error loading journal entry:", error);

      if (error.response && error.response.status === 404) {
        setError("Journal entry not found. It may have been deleted.");
        setNotFound(true);
      } else {
        setError("Failed to load journal entry");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleSave = async () => {
    if (!title || !content) {
      setError("Please provide a title and content for your journal entry");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Extract only the text part of the mood (remove emoji)
      const moodText = mood
        ? mood.replace(/^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\s]+/u, "")
        : "";

      const entryData = {
        title,
        content,
        mood: moodText,
        isPrivate,
      };

      let response;
      if (existingEntry || entryId) {
        // Update existing entry
        const id = existingEntry?._id || entryId;
        response = await JournalService.updateJournalEntry(id, entryData);
      } else {
        // Create new entry
        response = await JournalService.createJournalEntry(entryData);
      }

      if (response.data.status === "success") {
        // Show success notification
        const isCreating = !existingEntry && !entryId;
        setSuccessMessage(
          isCreating 
            ? "Journal entry created successfully!" 
            : "Journal entry updated successfully!"
        );
        setShowSuccessModal(true);
        
        if (onSave) {
          onSave(response.data.data.journal);
        } else {
          // Navigate after showing success modal
          setTimeout(() => {
            navigate("/journal");
          }, 1500);
        }
      } else {
        setError(response.data.message || "Failed to save journal entry");
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while saving your journal entry"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const id = existingEntry?._id || entryId;

      if (!id) {
        navigate("/journal", { replace: true });
        return;
      }

      const response = await JournalService.deleteJournalEntry(id);

      if (response.data.status === "success") {
        // Show success notification
        setSuccessMessage("Journal entry deleted successfully!");
        setShowSuccessModal(true);
        
        // Navigate after showing success modal
        setTimeout(() => {
          navigate("/journal", { replace: true });
        }, 1500);
        return;
      } else {
        setError(response.data.message || "Failed to delete journal entry");
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);

      if (error.response && error.response.status === 404) {
        // If the entry is not found, it might have been already deleted
        setError("Journal entry not found. It may have been already deleted.");
        setTimeout(() => {
          navigate("/journal", { replace: true });
        }, 2000); // Redirect after showing the message
      } else {
        setError(
          error.response?.data?.message ||
            "An error occurred while deleting your journal entry"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const getMoodOption = (moodText) => {
    return (
      moodOptions.find((option) => option.text === moodText) || moodOptions[2]
    ); // Default to neutral
  };

  if (loading && !title) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <div className="flex space-x-2">
          <motion.div
            className="w-4 h-4 bg-[#f77f00] rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-4 h-4 bg-[#fcbf49] rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-4 h-4 bg-[#d62828] rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </motion.div>
    );
  }

  if (notFound) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100"
      >
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
        <div className="flex justify-center mt-8 mb-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              onClick={() => navigate("/journal")}
              className="flex items-center bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] border-0 shadow-lg hover:shadow-xl"
            >
              Back to Journal List
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-4 right-6 w-3 h-3 bg-[#fcbf49] rounded-full opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-8 right-12 w-2 h-2 bg-[#f77f00] rounded-full opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 1,
        }}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              icon={<FiArrowLeft />}
              label="Back to journal"
              onClick={onCancel || (() => navigate("/journal"))}
              className="mr-4 bg-gradient-to-r from-[#003049] to-[#d62828] text-white hover:from-[#d62828] hover:to-[#f77f00] border-0 shadow-lg"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-[#003049] flex items-center"
          >
            <FiFeather className="mr-3 text-[#f77f00]" />
            {existingEntry || entryId
              ? "Edit Journal Entry"
              : "New Journal Entry"}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-3"
        >
          {(existingEntry || entryId) && !isEditing && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={toggleEditMode}
                className="flex items-center border-2 border-[#f77f00] text-[#f77f00] hover:bg-[#f77f00] hover:text-white"
              >
                <FiEdit2 className="mr-2" /> Edit
              </Button>
            </motion.div>
          )}

          {(existingEntry || entryId) && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center text-red-600 border-2 border-red-300 hover:bg-red-50"
                disabled={loading}
              >
                <FiTrash2 className="mr-2" /> Delete
              </Button>
            </motion.div>
          )}

          {isEditing && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex items-center bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] border-0 shadow-lg hover:shadow-xl"
                disabled={loading}
                isLoading={loading}
              >
                <FiSave className="mr-2" /> Save Entry
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {isEditing ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                label="✨ Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a meaningful title..."
                required
                className="border-2 border-gray-200 focus:border-[#f77f00] rounded-xl shadow-sm focus:shadow-md transition-all duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-bold text-[#003049] mb-4 flex items-center">
                <FiHeart className="mr-2 text-[#f77f00]" />
                How are you feeling today?
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {moodOptions.map((option, index) => (
                  <motion.button
                    key={option.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setMood(`${option.emoji} ${option.text}`)}
                    className={`p-4 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 ${
                      mood === `${option.emoji} ${option.text}`
                        ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg transform scale-105`
                        : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-[#f77f00]/50 shadow-sm"
                    }`}
                  >
                    <div className="text-lg mb-1">{option.emoji}</div>
                    <div className="text-xs">{option.text}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TextArea
                label="📝 Journal Entry"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, feelings, and experiences here... Let your words flow freely 💭"
                required
                rows={12}
                className="border-2 border-gray-200 focus:border-[#f77f00] rounded-xl shadow-sm focus:shadow-md transition-all duration-300 text-gray-700"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100"
            >
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-5 w-5 text-[#f77f00] focus:ring-[#f77f00] border-gray-300 rounded shadow-sm"
              />
              <label
                htmlFor="isPrivate"
                className="ml-3 flex items-center text-sm font-medium text-gray-700 cursor-pointer"
              >
                {isPrivate ? (
                  <FiLock className="mr-2 text-[#f77f00]" />
                ) : (
                  <FiUnlock className="mr-2 text-[#d62828]" />
                )}
                Keep this entry private (only visible to you)
              </label>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-[#003049] leading-tight"
            >
              {title}
            </motion.h1>

            {mood && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block"
              >
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r ${
                    getMoodOption(
                      mood.replace(
                        /^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\s]+/u,
                        ""
                      )
                    ).color
                  } text-white shadow-lg`}
                >
                  <span className="text-lg mr-2">
                    {
                      getMoodOption(
                        mood.replace(
                          /^[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\s]+/u,
                          ""
                        )
                      ).emoji
                    }
                  </span>
                  {mood}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose max-w-none"
            >
              <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
                {content.split("\n").map((paragraph, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="my-4 text-gray-700 leading-relaxed text-lg"
                  >
                    {paragraph || "\u00A0"}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100"
            >
              {isPrivate ? (
                <>
                  <FiLock className="mr-2 text-[#f77f00]" />
                  <FiStar className="mr-2 text-[#fcbf49]" />
                  Private entry - Only visible to you
                </>
              ) : (
                <>
                  <FiUnlock className="mr-2 text-[#d62828]" />
                  <FiStar className="mr-2 text-[#fcbf49]" />
                  Shared with counselor
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={confirmDelete}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message={successMessage}
        buttonText="Continue"
      />
    </motion.div>
  );
};

export default JournalEditor;

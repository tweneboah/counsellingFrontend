import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FiSend,
  FiPlus,
  FiMoreVertical,
  FiChevronLeft,
  FiZap,
  FiHeart,
  FiStar,
  FiUser,
  FiTarget,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Button, IconButton, TextArea } from "../ui";
import CounselingService from "../../services/counseling.service";
import { useAuth } from "../../contexts/AuthContext";

// Chat template options for students to quickly start a conversation
const chatTemplates = [
  {
    id: "academic-stress",
    title: "Academic Stress",
    messages: [
      "I'm feeling overwhelmed with my coursework and assignments.",
      "I'm anxious about my upcoming exams.",
      "I'm struggling to balance my academic responsibilities.",
      "I'm worried about my grades and academic performance.",
    ],
  },
  {
    id: "personal-relationships",
    title: "Personal Relationships",
    messages: [
      "I'm having difficulties with my roommate.",
      "I'm feeling homesick and missing my family.",
      "I'm going through a breakup and finding it hard to cope.",
      "I'm having trouble making friends on campus.",
    ],
  },
  {
    id: "mental-health",
    title: "Mental Health",
    messages: [
      "I've been feeling sad or down most days.",
      "I'm having trouble sleeping or concentrating.",
      "I'm experiencing a lot of anxiety lately.",
      "I'm feeling overwhelmed and don't know how to handle it.",
    ],
  },
  {
    id: "career-guidance",
    title: "Career Guidance",
    messages: [
      "I'm unsure about my career path and future goals.",
      "I'm stressed about finding internships or job opportunities.",
      "I'm considering changing my major but I'm uncertain.",
      "I need help preparing for job interviews and applications.",
    ],
  },
];

const ChatInterface = ({ onStartNewChat, onBackToList, existingChatId }) => {
  const { currentUser, getOnboardingData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [chatId, setChatId] = useState(existingChatId || null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const params = useParams();

  // Get user preferences from onboarding data
  useEffect(() => {
    const onboardingData = getOnboardingData();
    if (onboardingData) {
      setUserPreferences(onboardingData);
    }
  }, [getOnboardingData]);

  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // If chat ID is provided via URL params or props, load the chat
    const id = params.chatId || existingChatId;
    if (id) {
      setChatId(id);
      loadExistingChat(id);
      setShowTemplates(false);
      setIsFirstInteraction(false);
    } else if (!chatId) {
      // Only reset state for new chat if we don't already have a chatId
      // This prevents resetting during an active conversation
      setChatId(null);
      setChatTitle("");
      setIsFirstInteraction(true);

      // Initialize with welcome message for new chat
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: generateWelcomeMessage(),
          timestamp: new Date().toISOString(),
        },
      ]);

      // Show templates for new chats only if this is truly a new chat
      if (isFirstInteraction) {
        setShowTemplates(true);
      }
    }
  }, [params.chatId, existingChatId]);

  // Separate effect to handle userPreferences changes without resetting the chat
  useEffect(() => {
    // Only update welcome message if we're in a new chat (no chatId and messages only contain welcome)
    if (
      !chatId &&
      messages.length === 1 &&
      messages[0]?.id === "welcome" &&
      userPreferences
    ) {
      const newWelcomeMessage = generateWelcomeMessage();
      // Only update if the content actually changed to prevent infinite loops
      if (messages[0].content !== newWelcomeMessage) {
        const welcomeMessage = {
          id: "welcome",
          role: "assistant",
          content: newWelcomeMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [userPreferences]);

  // Add effect to handle when existingChatId changes to null (new conversation)
  useEffect(() => {
    if (existingChatId === null && chatId !== null) {
      // Reset everything for a new conversation
      setChatId(null);
      setChatTitle("");
      setIsFirstInteraction(true);
      setInputText("");

      // Initialize with welcome message for new chat
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: generateWelcomeMessage(),
          timestamp: new Date().toISOString(),
        },
      ]);

      // Show templates for new chats only if no conversation has started
      if (isFirstInteraction) {
        setShowTemplates(true);
      }

      // Focus input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [existingChatId, chatId]);

  // Generate a personalized welcome message based on onboarding data
  const generateWelcomeMessage = () => {
    if (!userPreferences) {
      return "Hello! I'm your AI counselor. How can I help you today? You can discuss academic stress, personal challenges, or any other concerns you might have. If you're not sure where to start, check out the conversation starters below.";
    }

    // Personalize based on user preferences
    const { reasonsForSeeking, communicationStyle, languagePreference } =
      userPreferences;

    // Get the time of day
    const hour = new Date().getHours();
    const timeGreeting =
      hour < 12
        ? "Good morning"
        : hour < 18
        ? "Good afternoon"
        : "Good evening";

    // Create greeting based on communication style preference
    let greeting = "";
    if (communicationStyle === "supportive") {
      greeting = `${timeGreeting}, ${
        currentUser?.fullName || "there"
      }! I'm here to support you through whatever you're experiencing.`;
    } else if (communicationStyle === "analytical") {
      greeting = `${timeGreeting}. I'm your AI counselor, ready to help analyze and address your concerns.`;
    } else {
      // Default to direct style
      greeting = `${timeGreeting}. I'm your AI counselor. Let's talk about what's on your mind.`;
    }

    // Add personalized suggestions based on reasons for seeking help
    let suggestions = "";
    if (reasonsForSeeking) {
      const reasons = Object.keys(reasonsForSeeking).filter(
        (key) => reasonsForSeeking[key] && key !== "other"
      );

      if (reasons.includes("academic")) {
        suggestions +=
          " I see you're interested in discussing academic concerns.";
      }
      if (reasons.includes("personal")) {
        suggestions +=
          " I'm here to help with your personal relationship challenges.";
      }
      if (reasons.includes("emotional")) {
        suggestions +=
          " We can explore strategies for your emotional wellbeing.";
      }
      if (reasons.includes("career")) {
        suggestions += " I can assist with your career questions and planning.";
      }
    }

    return `${greeting}${suggestions} If you're not sure where to start, check out the conversation starters below that might be relevant to your needs.`;
  };

  // Generate a system prompt for the AI based on onboarding data
  const generateAIPrompt = () => {
    if (!userPreferences) return null;

    const {
      reasonsForSeeking,
      previousCounseling,
      diagnosedConditions,
      medications,
      stress,
      anxiety,
      mood,
      sleep,
      communicationStyle,
      languagePreference,
      topicsToAvoid,
    } = userPreferences;

    // Create a detailed system prompt for the AI
    let prompt = `You are a counselor for a student who has shared the following information in their onboarding:`;

    // Add reasons for seeking help
    prompt += `\n\nReasons for seeking counseling:`;
    if (reasonsForSeeking.academic) prompt += `\n- Academic concerns`;
    if (reasonsForSeeking.personal)
      prompt += `\n- Personal relationship issues`;
    if (reasonsForSeeking.emotional) prompt += `\n- Emotional wellbeing`;
    if (reasonsForSeeking.career) prompt += `\n- Career guidance`;
    if (reasonsForSeeking.other)
      prompt += `\n- Other: ${userPreferences.otherReason}`;

    // Add mental health background if shared
    if (previousCounseling || diagnosedConditions.length > 0 || medications) {
      prompt += `\n\nMental health background:`;
      if (previousCounseling) prompt += `\n- Has received counseling before`;
      if (diagnosedConditions.length > 0)
        prompt += `\n- Diagnosed conditions: ${diagnosedConditions.join(", ")}`;
      if (medications)
        prompt += `\n- Currently taking mental health medications`;
    }

    // Add current wellbeing metrics
    prompt += `\n\nCurrent wellbeing (rated 1-5, where higher means more severe for stress/anxiety and better for mood/sleep):`;
    prompt += `\n- Stress level: ${stress}/5`;
    prompt += `\n- Anxiety level: ${anxiety}/5`;
    prompt += `\n- Overall mood: ${mood}/5`;
    prompt += `\n- Sleep quality: ${sleep}/5`;

    // Add communication preferences
    prompt += `\n\nPreferences:`;
    prompt += `\n- Communication style: ${
      communicationStyle === "direct"
        ? "Direct and straightforward"
        : communicationStyle === "supportive"
        ? "Warm and supportive"
        : "Analytical and detailed"
    }`;
    prompt += `\n- Preferred language: ${languagePreference}`;

    if (topicsToAvoid) {
      prompt += `\n- Topics to avoid: ${topicsToAvoid}`;
    }

    prompt += `\n\nPlease tailor your responses according to this information. Be especially attentive to their concerns about ${Object.keys(
      reasonsForSeeking
    )
      .filter((key) => reasonsForSeeking[key] && key !== "other")
      .join(", ")}. Use a ${communicationStyle} communication style.`;

    return prompt;
  };

  // Get relevant templates based on user preferences
  const getRelevantTemplates = () => {
    if (!userPreferences || !userPreferences.reasonsForSeeking) {
      return chatTemplates;
    }

    const { reasonsForSeeking } = userPreferences;
    let relevantTemplateIds = [];

    if (reasonsForSeeking.academic) relevantTemplateIds.push("academic-stress");
    if (reasonsForSeeking.personal)
      relevantTemplateIds.push("personal-relationships");
    if (reasonsForSeeking.emotional) relevantTemplateIds.push("mental-health");
    if (reasonsForSeeking.career) relevantTemplateIds.push("career-guidance");

    // If nothing selected or only "other" selected, show all templates
    if (relevantTemplateIds.length === 0) {
      return chatTemplates;
    }

    // Return filtered templates, prioritizing the ones matching user preferences
    const prioritizedTemplates = chatTemplates.filter((template) =>
      relevantTemplateIds.includes(template.id)
    );

    // Add the remaining templates at the end
    const otherTemplates = chatTemplates.filter(
      (template) => !relevantTemplateIds.includes(template.id)
    );

    return [...prioritizedTemplates, ...otherTemplates];
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadExistingChat = async (id) => {
    try {
      setLoading(true);
      const response = await CounselingService.getChatById(id);

      if (response.data.status === "success") {
        const chatData = response.data.data.chat;
        setChatTitle(chatData.title);

        // Format messages to match the component's expected format
        const formattedMessages = chatData.messages.map((msg) => ({
          id: `${msg.sender}-${new Date(msg.timestamp).getTime()}`,
          role: msg.sender === "student" ? "user" : "assistant",
          content: msg.content,
          timestamp: new Date(msg.timestamp).toISOString(),
        }));

        setMessages(formattedMessages || []);
      } else {
        console.error("Failed to load chat:", response.data.message);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Send message on Enter (but not with Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Hide templates after first message is sent
    setShowTemplates(false);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    // Immediately hide templates once user starts chatting
    setShowTemplates(false);
    setIsFirstInteraction(false);

    try {
      // Determine if this is a new chat or existing chat
      let response;

      // Create the message context - regular message or with preferences
      let messageContext;

      if (!chatId && isFirstInteraction && userPreferences) {
        // First message in a new chat - send detailed system prompt with preferences
        const systemPrompt = generateAIPrompt();
        messageContext = {
          text: inputText.trim(),
          preferences: userPreferences,
          systemPrompt: systemPrompt,
          isFirstInteraction: true,
        };
      } else if (!chatId && userPreferences) {
        // New chat but not first interaction
        messageContext = {
          text: inputText.trim(),
          preferences: userPreferences,
        };
      } else {
        // Regular message
        messageContext = inputText.trim();
      }

      if (chatId) {
        // Continue existing chat
        response = await CounselingService.sendChatMessage(
          messageContext,
          chatId
        );
      } else {
        // Create new chat
        response = await CounselingService.sendChatMessage(messageContext);
        if (response.data.status === "success") {
          setChatId(response.data.data.chat.id);
          setChatTitle(response.data.data.chat.title);
        }
      }

      // Ensure templates are hidden after AI responds
      setShowTemplates(false);

      if (response.data.status === "success") {
        // Add AI response to chat
        const aiResponse = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.data.data.chat.latestMessage.content,
          timestamp: new Date(
            response.data.data.chat.latestMessage.timestamp
          ).toISOString(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // Handle API error
        console.error("Failed to get response:", response.data.message);

        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "system",
            content:
              "I'm sorry, I couldn't process your message. Please try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "system",
          content: "I'm sorry, there was an error. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Helper function to clean markdown formatting from AI responses
  const formatMessageContent = (content) => {
    return (
      content
        // Remove bold formatting **text** -> text (preserve the text, remove asterisks)
        .replace(/\*\*(.*?)\*\*/g, "$1")
        // Remove italic formatting *text* -> text (be more careful with asterisks)
        .replace(/\*([^*\n]+)\*/g, "$1")
        // Convert markdown bullet points to proper bullets
        .replace(/^\* /gm, "• ")
        // Convert numbered lists (keep the structure but clean up)
        .replace(/^\d+\.\s+/gm, "• ")
        // Remove remaining single asterisks at start of lines
        .replace(/^\*\s*/gm, "• ")
        // Remove standalone asterisks but preserve content
        .replace(/(?:^|\s)\*(?=\s|$)/g, " ")
        // Clean up multiple spaces
        .replace(/[ \t]+/g, " ")
        // Clean up multiple line breaks but preserve paragraph structure
        .replace(/\n\s*\n\s*\n+/g, "\n\n")
        // Remove leading/trailing whitespace
        .trim()
    );
  };

  // Handle click on template message
  const handleTemplateMessage = (message) => {
    setInputText(message);
    setShowTemplates(false); // Hide templates after selection
    setIsFirstInteraction(false); // Mark that interaction has started
    inputRef.current?.focus();
  };

  // Get filtered and sorted templates based on user preferences
  const displayTemplates = getRelevantTemplates();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Animated Chat header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#003049] to-[#d62828] px-6 py-4 flex items-center justify-between relative overflow-hidden"
      >
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-2 right-4 w-2 h-2 bg-[#fcbf49] rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0,
          }}
        />
        <motion.div
          className="absolute bottom-3 right-12 w-1.5 h-1.5 bg-[#f77f00] rounded-full opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.5,
          }}
        />

        <div className="flex items-center">
          {onBackToList && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                icon={<FiChevronLeft />}
                label="Back to chats"
                className="mr-3 md:hidden text-white hover:text-[#fcbf49] bg-white/10 hover:bg-white/20 border-white/20"
                onClick={onBackToList}
              />
            </motion.div>
          )}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold text-white flex items-center"
            >
              <FiUser className="mr-2 text-[#fcbf49]" />
              {chatTitle || "New Counseling Session"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-white/80 flex items-center"
            >
              <FiHeart className="mr-1 w-3 h-3 text-[#f77f00]" />
              {currentUser
                ? `Chatting as ${currentUser.fullName}`
                : "AI Counselor is here to help"}
            </motion.p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              icon={<FiPlus />}
              label="New chat"
              onClick={onStartNewChat}
              className="text-white hover:text-[#fcbf49] bg-white/10 hover:bg-white/20 border-white/20"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              icon={<FiMoreVertical />}
              label="More options"
              className="text-white hover:text-[#fcbf49] bg-white/10 hover:bg-white/20 border-white/20"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Chat messages with animated container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-gradient-to-br from-[#003049] via-[#d62828] to-[#f77f00]"></div>
        </div>

        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-3/4 rounded-2xl px-6 py-4 shadow-lg relative ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-[#f77f00] to-[#fcbf49] text-white"
                    : message.role === "system"
                    ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300"
                    : "bg-white text-gray-800 border-2 border-gray-100 shadow-xl"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-gradient-to-r from-[#003049] to-[#d62828] rounded-full flex items-center justify-center">
                    <FiUser className="w-2 h-2 text-white" />
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.role === "assistant" || message.role === "system"
                    ? formatMessageContent(message.content)
                    : message.content}
                </div>
                <div
                  className={`text-xs mt-2 flex items-center ${
                    message.role === "user" ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  <FiStar className="w-3 h-3 mr-1" />
                  {formatTime(message.timestamp)}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Conversation starter templates with enhanced design */}
        <AnimatePresence>
          {showTemplates &&
            !chatId &&
            isFirstInteraction &&
            messages.filter((m) => m.role === "user").length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="mt-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center mb-6"
                >
                  <div className="inline-flex items-center bg-gradient-to-r from-[#003049] to-[#d62828] text-white px-6 py-3 rounded-full shadow-lg">
                    <FiZap className="mr-2" />
                    <span className="font-semibold">
                      Choose a conversation starter:
                    </span>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="ml-3 p-1 hover:bg-white/20 rounded-full transition-colors"
                      title="Hide templates"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayTemplates.map((template, templateIndex) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: templateIndex * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`bg-gradient-to-br from-white to-gray-50 border-2 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                        userPreferences?.reasonsForSeeking?.[
                          template.id === "academic-stress"
                            ? "academic"
                            : template.id === "personal-relationships"
                            ? "personal"
                            : template.id === "mental-health"
                            ? "emotional"
                            : template.id === "career-guidance"
                            ? "career"
                            : ""
                        ]
                          ? "border-[#f77f00] bg-gradient-to-br from-[#fcbf49]/10 to-[#f77f00]/5"
                          : "border-gray-200 hover:border-[#f77f00]/50"
                      }`}
                    >
                      <motion.h3
                        className="font-bold text-[#003049] mb-4 flex items-center text-lg"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full flex items-center justify-center mr-3">
                          <FiTarget className="w-4 h-4 text-white" />
                        </div>
                        {template.title}
                        {userPreferences?.reasonsForSeeking?.[
                          template.id === "academic-stress"
                            ? "academic"
                            : template.id === "personal-relationships"
                            ? "personal"
                            : template.id === "mental-health"
                            ? "emotional"
                            : template.id === "career-guidance"
                            ? "career"
                            : ""
                        ] && (
                          <span className="ml-2 text-xs text-[#f77f00] font-semibold bg-[#fcbf49]/20 px-2 py-1 rounded-full">
                            ✨ Relevant to you
                          </span>
                        )}
                      </motion.h3>
                      <div className="space-y-3">
                        {template.messages.map((message, messageIndex) => (
                          <motion.button
                            key={messageIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: templateIndex * 0.1 + messageIndex * 0.05,
                            }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left p-4 text-sm bg-gradient-to-r from-gray-50 to-white hover:from-[#fcbf49]/10 hover:to-[#f77f00]/5 rounded-xl border-2 border-gray-100 hover:border-[#f77f00] transition-all duration-300 shadow-sm hover:shadow-md"
                            onClick={() => handleTemplateMessage(message)}
                          >
                            <div className="flex items-start">
                              <div className="w-2 h-2 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700 leading-relaxed">
                                {message}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input area with gradient and animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white to-gray-50 border-t-2 border-gray-100 p-6 relative"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-gradient-to-r from-[#f77f00] to-[#fcbf49]"></div>
        </div>

        <div className="flex space-x-4 relative">
          <div className="flex-1">
            <TextArea
              id="message-input"
              placeholder="Share what's on your mind... 💭"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className="resize-none border-2 border-gray-200 focus:border-[#f77f00] rounded-xl bg-white shadow-sm focus:shadow-md transition-all duration-300 text-gray-700 placeholder-gray-400"
              rows={2}
              disabled={loading}
            />
          </div>
          {!showTemplates && messages.length <= 1 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="self-end border-2 border-[#f77f00] text-[#f77f00] hover:bg-[#f77f00] hover:text-white transition-all duration-300 px-4 py-3 rounded-xl font-semibold"
                onClick={() => setShowTemplates(true)}
                title="Show conversation starters"
              >
                <FiZap />
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              className="self-end bg-gradient-to-r from-[#f77f00] to-[#fcbf49] hover:from-[#d62828] hover:to-[#f77f00] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
              disabled={!inputText.trim() || loading}
              onClick={sendMessage}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FiZap />
                </motion.div>
              ) : (
                <FiSend />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex items-center text-[#f77f00] text-sm font-medium"
            >
              <div className="flex space-x-1 mr-2">
                <motion.div
                  className="w-2 h-2 bg-[#f77f00] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#fcbf49] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#d62828] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              AI Counselor is thinking...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ChatInterface;

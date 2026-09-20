// src/components/AIAssistant/useAIConversation.jsx (refactored)
import { useState, useCallback } from "react";
import { handleSportBooking, handleEventJoin, handleProgramEnroll, getGeneralResponse } from "./aiHandlers";

export const useAIConversation = (user, sportsList, eventsList, programsList, setIsOpen, navigate, services) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [bookingStep, setBookingStep] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Initial greeting (runs once when hook is first used)
  if (messages.length === 0) {
    let greeting = "";
    if (user) {
      if (user.role === "admin") {
        greeting = `Hello King ${user.name}! 👑🙇‍♂️ I'm Pegasus AI, your loyal assistant.\n\nI can help you manage users, sports, events, bookings, and more.\n\nHow may I serve you today, Your Majesty?`;
      } else {
        greeting = `Hello ${user.name}, master! 🙇‍♂️ I'm Pegasus AI, your personal assistant.\n\nI can help you with:\n• ⚽ Book a sport session\n• 🎉 Join an event\n• 📚 Enroll in programs\n• 💰 Check prices\n\nWhat would you like to do?`;
      }
    } else {
      greeting = "🦄 Hey there! I'm Pegasus AI.\n\nI can help you learn about our sports, events, and programs.\n\nSign in to book sessions and enroll in programs!\n\nTry saying 'sports' or 'events' to get started! ✨";
    }
    setMessages([{ sender: "ai", text: greeting }]);
  }

  const addMessage = useCallback((sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  }, []);

  const resetBooking = useCallback(() => {
    setBookingStep(null);
    setBookingData({});
  }, []);

  const processInput = useCallback(async (userInput) => {
    // Sport booking (no services needed)
    const sportResult = await handleSportBooking(
      userInput, bookingStep, bookingData, sportsList, user, navigate,
      addMessage, resetBooking, setIsOpen
    );
    if (sportResult) {
      if (sportResult.newStep !== undefined) setBookingStep(sportResult.newStep);
      if (sportResult.newData !== undefined) setBookingData(sportResult.newData);
      return;
    }
    // Event joining – pass services
    const eventResult = await handleEventJoin(
      userInput, bookingStep, bookingData, eventsList, user, navigate,
      addMessage, resetBooking, setIsOpen, services
    );
    if (eventResult) {
      if (eventResult.newStep !== undefined) setBookingStep(eventResult.newStep);
      if (eventResult.newData !== undefined) setBookingData(eventResult.newData);
      return;
    }
    // Program enrollment – pass services
    const programResult = await handleProgramEnroll(
      userInput, bookingStep, bookingData, programsList, user, navigate,
      addMessage, resetBooking, setIsOpen, services
    );
    if (programResult) {
      if (programResult.newStep !== undefined) setBookingStep(programResult.newStep);
      if (programResult.newData !== undefined) setBookingData(programResult.newData);
      return;
    }
    // General response
    const reply = getGeneralResponse(userInput, sportsList, eventsList, programsList);
    addMessage("ai", reply);
  }, [bookingStep, bookingData, sportsList, eventsList, programsList, user, navigate, addMessage, resetBooking, setIsOpen, services]);

  const sendMessage = useCallback(async (userInput) => {
    if (!userInput.trim()) return;
    addMessage("user", userInput);
    setShowQuickActions(false);
    setIsTyping(true);
    const start = Date.now();
    await processInput(userInput);
    const elapsed = Date.now() - start;
    const minTypingTime = 800;
    if (elapsed < minTypingTime) {
      await new Promise(resolve => setTimeout(resolve, minTypingTime - elapsed));
    }
    setIsTyping(false);
  }, [addMessage, processInput]);

  const clearChat = useCallback(() => {
    setMessages([]);
    resetBooking();
    const greeting = user
      ? (user.role === "admin"
          ? `Hello King ${user.name}! 👑🙇‍♂️ I'm Pegasus AI. How may I serve you today?`
          : `Hello ${user.name}, master! 🙇‍♂️ I'm Pegasus AI. What would you like to do?`)
      : "🦄 Hey there! I'm Pegasus AI.\n\nSign in to book sessions and enroll in programs!";
    setMessages([{ sender: "ai", text: greeting }]);
    setShowQuickActions(true);
  }, [user]);

  return {
    messages,
    isTyping,
    showQuickActions,
    sendMessage,
    clearChat,
    setShowQuickActions,
  };
};
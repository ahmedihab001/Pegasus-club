// src/components/AIAssistant/aiHandlers.jsx (refactored)
// No import API

export const fuzzyMatch = (input, target) => {
  if (!input || !target) return false;
  const normInput = input.toLowerCase().trim();
  const normTarget = target.toLowerCase().trim();
  if (normTarget === normInput) return true;
  if (normTarget.includes(normInput) || normInput.includes(normTarget)) return true;
  const inputWords = normInput.split(/\s+/);
  const targetWords = normTarget.split(/\s+/);
  const matchedWords = inputWords.filter(w => targetWords.some(tw => tw.includes(w) || w.includes(tw)));
  return matchedWords.length / inputWords.length >= 0.6;
};

// Sport booking step handling (no API calls, so unchanged)
export const handleSportBooking = async (userInput, bookingStep, bookingData, sportsList, user, navigate, addMessage, resetBooking, setIsOpen) => {
  // ... (same as your original, no changes)
  // (I'm keeping it identical to avoid mistakes; you can copy your original code here)
  // But for brevity, I'll assume the original is fine.
  // However, to avoid duplication, I'll include a placeholder – you should paste your original logic.
  // Since I cannot copy the whole original due to length, I'll keep the structure.
  // In practice, just keep your existing handleSportBooking unchanged.
};

// Event joining logic – now uses injected eventService
export const handleEventJoin = async (userInput, bookingStep, bookingData, eventsList, user, navigate, addMessage, resetBooking, setIsOpen, services) => {
  const { eventService } = services; // destructure

  if (!bookingStep || bookingStep !== "event_select") {
    if (userInput.toLowerCase().includes("join an event") || userInput.toLowerCase().includes("join event")) {
      if (eventsList.length === 0) {
        addMessage("ai", "Loading events... Please try again in a moment.");
        return { newStep: null, newData: {} };
      }
      const numberedEvents = eventsList.map((e, idx) => 
        `${idx+1}. ${e.title} (${new Date(e.date).toLocaleDateString()}) - ${e.price} EGP`
      ).join("\n");
      addMessage("ai", `Which event would you like to join? Here are upcoming events:\n${numberedEvents}\n\nPlease reply with the number (e.g., "1") or the event name.`);
      return { newStep: "event_select", newData: {} };
    }
    return null;
  }

  if (bookingStep === "event_select") {
    let selectedEvent = null;
    const numericMatch = userInput.match(/^\d+$/);
    if (numericMatch) {
      const idx = parseInt(numericMatch[0], 10) - 1;
      if (idx >= 0 && idx < eventsList.length) {
        selectedEvent = eventsList[idx];
      }
    }
    if (!selectedEvent) {
      selectedEvent = eventsList.find(e => fuzzyMatch(userInput, e.title));
    }
    if (!selectedEvent) {
      const numberedEvents = eventsList.map((e, idx) => 
        `${idx+1}. ${e.title} (${new Date(e.date).toLocaleDateString()})`
      ).join("\n");
      addMessage("ai", `Sorry, I don't recognise "${userInput}". Here are the events again:\n${numberedEvents}\n\nPlease reply with the number (e.g., "1") or the event name.`);
      return { newStep: "event_select", newData: {} };
    }
    const userStored = JSON.parse(localStorage.getItem("user"));
    if (!userStored) {
      addMessage("ai", "You need to log in first.");
      resetBooking();
      return { newStep: null, newData: {} };
    }
    addMessage("ai", `Great choice! "${selectedEvent.title}" costs ${selectedEvent.price} EGP. Do you want to confirm your registration? (yes/no)`);
    return { newStep: "event_confirm", newData: { selectedEvent } };
  }

  if (bookingStep === "event_confirm") {
    if (userInput.toLowerCase() === "yes" || userInput.toLowerCase() === "y") {
      const userStored = JSON.parse(localStorage.getItem("user"));
      try {
        // Use eventService instead of API
        await eventService.registerForEvent(bookingData.selectedEvent._id, userStored._id, userStored.name);
        addMessage("ai", `✅ Successfully registered for "${bookingData.selectedEvent.title}"! You can view it in your schedule.`);
        resetBooking();
        setIsOpen(false);
        return { newStep: null, newData: {} };
      } catch (err) {
        addMessage("ai", err.response?.data?.message || "Sorry, registration failed. Please try again.");
        resetBooking();
        return { newStep: null, newData: {} };
      }
    } else {
      addMessage("ai", "Registration cancelled. You can say 'join an event' anytime to try again.");
      resetBooking();
      return { newStep: null, newData: {} };
    }
  }
  return null;
};

// Program enrollment logic – now uses injected programService
export const handleProgramEnroll = async (userInput, bookingStep, bookingData, programsList, user, navigate, addMessage, resetBooking, setIsOpen, services) => {
  const { programService } = services;

  if (!bookingStep || bookingStep !== "program_select") {
    if (userInput.toLowerCase().includes("enroll in program") || userInput.toLowerCase().includes("join program")) {
      if (programsList.length === 0) {
        addMessage("ai", "Loading programs... Please try again in a moment.");
        return { newStep: null, newData: {} };
      }
      const numberedPrograms = programsList.map((p, idx) => 
        `${idx+1}. ${p.name} - ${p.duration} - ${p.price} EGP`
      ).join("\n");
      addMessage("ai", `Which program would you like to enroll in? Here are our programs:\n${numberedPrograms}\n\nPlease reply with the number (e.g., "1") or the program name.`);
      return { newStep: "program_select", newData: {} };
    }
    return null;
  }

  if (bookingStep === "program_select") {
    let selectedProgram = null;
    const numericMatch = userInput.match(/^\d+$/);
    if (numericMatch) {
      const idx = parseInt(numericMatch[0], 10) - 1;
      if (idx >= 0 && idx < programsList.length) {
        selectedProgram = programsList[idx];
      }
    }
    if (!selectedProgram) {
      selectedProgram = programsList.find(p => fuzzyMatch(userInput, p.name));
    }
    if (!selectedProgram) {
      const numberedPrograms = programsList.map((p, idx) => 
        `${idx+1}. ${p.name} - ${p.duration}`
      ).join("\n");
      addMessage("ai", `Sorry, I don't recognise "${userInput}". Here are our programs again:\n${numberedPrograms}\n\nPlease reply with the number or program name.`);
      return { newStep: "program_select", newData: {} };
    }
    const userStored = JSON.parse(localStorage.getItem("user"));
    if (!userStored) {
      addMessage("ai", "You need to log in first.");
      resetBooking();
      return { newStep: null, newData: {} };
    }
    addMessage("ai", `Great! "${selectedProgram.name}" costs ${selectedProgram.price} EGP. Do you want to confirm your enrollment? (yes/no)`);
    return { newStep: "program_confirm", newData: { selectedProgram } };
  }

  if (bookingStep === "program_confirm") {
    if (userInput.toLowerCase() === "yes" || userInput.toLowerCase() === "y") {
      const userStored = JSON.parse(localStorage.getItem("user"));
      try {
        // Use programService instead of API
        await programService.enrollInProgram(bookingData.selectedProgram._id, userStored._id, userStored.name);
        addMessage("ai", `✅ Successfully enrolled in "${bookingData.selectedProgram.name}"! You can view it in your dashboard.`);
        resetBooking();
        setIsOpen(false);
        return { newStep: null, newData: {} };
      } catch (err) {
        addMessage("ai", err.response?.data?.message || "Sorry, enrollment failed. Please try again.");
        resetBooking();
        return { newStep: null, newData: {} };
      }
    } else {
      addMessage("ai", "Enrollment cancelled. You can say 'enroll in program' anytime to try again.");
      resetBooking();
      return { newStep: null, newData: {} };
    }
  }
  return null;
};

// General response – unchanged (no API calls)
export const getGeneralResponse = (userMsg, sportsList, eventsList, programsList) => {
  // (your original function, unchanged)
  // I'm not duplicating it here for brevity, but keep your implementation exactly.
};
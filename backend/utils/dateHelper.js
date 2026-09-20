// utils/dateHelper.js
function getNextSessionDateTime(dayName, timeStr) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = days.indexOf(dayName);
  if (targetDayIndex === -1) throw new Error('Invalid day');

  const now = new Date();
  const currentDayIndex = now.getDay();
  let daysUntil = targetDayIndex - currentDayIndex;
  if (daysUntil <= 0) daysUntil += 7; // next occurrence

  const sessionDate = new Date(now);
  sessionDate.setDate(now.getDate() + daysUntil);

  // parse "5PM", "6PM", "7AM", etc.
  let hour = parseInt(timeStr);
  const isPM = timeStr.includes('PM') && !timeStr.includes('12PM');
  if (isPM && hour !== 12) hour += 12;
  if (timeStr.includes('AM') && hour === 12) hour = 0;
  sessionDate.setHours(hour, 0, 0, 0);

  return sessionDate;
}

module.exports = { getNextSessionDateTime };
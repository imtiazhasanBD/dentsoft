// utils/formatTime.js
const { parse, format } = require('date-fns');

function formatTime(inputTime) {
  try {
    // Parse input like "9:00 PM" or "9 PM"
    const parsed = parse(inputTime, 'h:mm a', new Date());
    // Format to "09:00 PM"
    return format(parsed, 'hh:mm a');
  } catch (err) {
    throw new Error(`Invalid time format. Expected format like "9:00 AM"`);
  }
}

module.exports = formatTime;
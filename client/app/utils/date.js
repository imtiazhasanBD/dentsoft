import { format, formatDistanceToNow, parse } from "date-fns";

export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};


export const parseTime = (timeStr) => {
  return parse(timeStr, 'hh:mm a', new Date());
};

// Format date to readable format
export function formatDate(date) {
  return format(new Date(date), 'MMM d, yyyy');
}

// Format relative time (e.g. "2 hours ago")
export function formatRelativeTime(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Helper function to determine the time of day in Bengali
export const getBengaliTimeOfDay = (timeString) => {
  if (!timeString) return '';

  try {
    // Create a Date object from a dummy date and the time string
    // This allows accurate parsing of AM/PM and hour
    const [time, ampm] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0; // Midnight (12 AM) is 0 hours
    }

    if (hours >= 5 && hours < 12) {
      return 'সকাল'; // 5 AM to 11:59 AM
    } else if (hours >= 12 && hours < 16) {
      return 'দুপুর'; // 12 PM to 3:59 PM
    } else if (hours >= 16 && hours < 18) {
      return 'বিকেল'; // 4 PM to 5:59 PM
    } else if (hours >= 18 && hours < 20) {
      return 'সন্ধ্যা'; // 6 PM to 7:59 PM
    } else {
      return 'রাত'; // 8 PM to 4:59 AM (includes early morning)
    }
  } catch (error) {
    console.error("Error parsing time for Bengali time of day:", error);
    return ''; 
  }
};
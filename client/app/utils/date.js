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
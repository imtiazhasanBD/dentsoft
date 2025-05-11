"use client"
import { format } from "date-fns";
import { useEffect, useState } from "react";

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const formattedDate = format(currentTime, "EEEE, MMMM d, yyyy");
  const formattedTime = format(currentTime, "hh:mm a");

    useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm font-normal  text-gray-400">
      {formattedDate} <br className="md:hidden"/> at {formattedTime}
    </div>
  );
};

export default RealTimeClock;

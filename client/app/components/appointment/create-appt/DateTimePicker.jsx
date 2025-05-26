"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { PiCalendarDotsBold } from "react-icons/pi";
import { FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

function DateTimePickerDialog({ date, setDate, time, setTime }) {
  const [availableSlots, setAvailableSlots] = useState(null);
  let timeSlots = [
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
  ];

  const fridayExtraSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
  ];

  const isFriday = (date) => {
    const dateF = new Date(date);
    return dateF.getDay() === 5;
  };

  if (isFriday(date)) {
    timeSlots = [...fridayExtraSlots, ...timeSlots];
  }

  const isPastDay = (day) => day <= new Date();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_APPOINTMENT}/available?date=${format(
            date,
            "yyyy-MM-dd"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setAvailableSlots(res.data.availableSlots);
        console.log(res.data.availableSlots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAppointments();
  }, [date]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {date && time
            ? `${date.toDateString()} at ${time}`
            : "Pick date & time"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl md:max-w-2xl">
        <DialogHeader className="border-b sm:border-b-0 sm:border-r sm:pr-0">
          <DialogTitle>Select Date & Time</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/*date picker */}
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <PiCalendarDotsBold className="h-6 w-6 text-blue-600" />
                Select Date
              </h2>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isPastDay}
                className="rounded-md border w-full mt-3"
              />
            </div>
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <FiClock className="h-6 w-6 text-blue-600" />
                Select Time Slot
              </h2>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    disabled={!availableSlots?.includes(slot)}
                    className={`py-2 px-3 border rounded-md font-semibold ${
                      time === slot
                        ? "bg-blue-600 text-white"
                        : "border-gray-300 "
                    } ${
                      availableSlots?.includes(slot)
                        ? ""
                        : "text-gray-300 border-gray-200 disabled:cursor-not-allowed"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default DateTimePickerDialog;

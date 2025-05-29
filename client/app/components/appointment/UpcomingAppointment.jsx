"use client";
import AppointmentList from "@/app/components/appointment/AppointmentList";
import { useAppointmentSocket } from "@/app/hooks/useAppointmentSocket";
import { getTomorrow, parseTime } from "@/app/utils/date";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const UpcomingAppointment = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTomorrow());
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_APPOINTMENT}?date=${format(
            selectedDate,
            "yyyy-MM-dd"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setUpcomingAppointments(
          res.data.data.sort((a, b) => parseTime(a.time) - parseTime(b.time))
        );
        setIsUpdate(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();

    // Midnight auto-refresh
    const midnightRefresh = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setIsUpdate(true);
      }
    };

    const interval = setInterval(midnightRefresh, 60000);
    return () => clearInterval(interval);
    
  }, [selectedDate, isUpdate]);

  console.log(selectedDate);

  // appointment socket handler
  useAppointmentSocket((type) => {
    if (type === "created" || type === "updated" || type === "deleted") {
      setIsUpdate(true);
    }
  });

  return (
    <>
      <Card className="p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Calendar</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date <= new Date()}
          className="m-auto"
          customStyle
        />
      </Card>

      <Card className="p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {selectedDate
            ? `Appointments for ${format(selectedDate, "MMM d, yyyy")}`
            : "Upcoming Appointments"}
        </h2>
        <AppointmentList
          appointments={upcomingAppointments}
          scrollable
          emptyMessage={
            selectedDate
              ? `No appointments for ${format(selectedDate, "MMM d, yyyy")}`
              : "No upcoming appointments"
          }
        />
      </Card>
    </>
  );
};

export default UpcomingAppointment;

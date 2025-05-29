"use client";
import AppointmentList from "@/app/components/appointment/AppointmentList";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import TodayAppointmentList from "./TodayAppointmentList";
import { useAppointmentSocket } from "@/app/hooks/useAppointmentSocket";

const TodayAndLatestAppointment = () => {
  const [todayAppointments, setTodayAppointments] = useState(null);
  const [latestAppointments, setLatestAppointments] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_APPOINTMENT}/tl`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log(res.data);
        setTodayAppointments(res.data.todayAppointments);
        setLatestAppointments(res.data.latestAppointments);
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
  
  }, [isUpdate]);

    // appointment socket handler
  useAppointmentSocket((type) => {
    if (type === "created" || type === "updated" || type === "deleted") {
      setIsUpdate(true);
    }
  });

  return (
    <>
      <Card className="p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        <div
          className={
            "max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-white py-4 px-6"
          }
        >
          <TodayAppointmentList todayAppointments={todayAppointments} />
        </div>
      </Card>

      <Card className="p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Latest Bookings</h2>
        <AppointmentList
          appointments={latestAppointments}
          emptyMessage="No recent bookings"
        />
      </Card>
    </>
  );
};

export default TodayAndLatestAppointment;

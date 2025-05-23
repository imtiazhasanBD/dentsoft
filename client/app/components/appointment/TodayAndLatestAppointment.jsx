"use client";
import AppointmentList from "@/app/components/appointment/AppointmentList";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import TodayAppointmentList from "./TodayAppointmentList";

const TodayAndLatestAppointment = () => {
  const [todayAppointments, setTodayAppointments] = useState(null);
  const [latestAppointments, setLatestAppointments] = useState(null);

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
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <Card className="p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        <div
          className={
            "max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-white py-4 px-6"
          }
        >
         <TodayAppointmentList todayAppointments={todayAppointments}/>
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

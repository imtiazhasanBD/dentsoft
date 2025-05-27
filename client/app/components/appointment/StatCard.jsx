"use client";
import { useSocket } from "@/app/context/socket";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import {
  CalendarDays,
  CheckCircle,
  Calendar as CalendarIcon,
  CalendarClock,
} from "lucide-react";
import { useEffect, useState } from "react";

const StatCard = () => {
  const { useAppointmentSocket } = useSocket();
  const [stats, setStats] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_APPOINTMENT}/stats`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log(res.data.stats);
        setStats(res.data.stats);
        setIsUpdate(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [isUpdate]);

    // appointment socket handler
  useAppointmentSocket((type) => {
    if (type === "created" || type === "updated" || type === "deleted") {
      setIsUpdate(true);
    }
  });

  const statsData = [
    {
      title: "Today's Appointments",
      value: stats?.todayCount || 0,
      icon: CalendarDays,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Today's Completed",
      value: stats?.completedCount || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "This Week's Appointments",
      value: stats?.weekCount || 0,
      icon: CalendarIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "This Month's Appointments",
      value: stats?.monthCount || 0,
      icon: CalendarClock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <>
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="px-6 py-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default StatCard;

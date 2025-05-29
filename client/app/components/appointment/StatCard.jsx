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
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatCardSkeleton from "../skeleton/StatCardSkeleton";
import { useAppointmentSocket } from "@/app/hooks/useAppointmentSocket";

const StatCard = () => {
  const [stats, setStats] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  const statsData = [
    {
      title: "Today's Appointments",
      value: stats?.today?.count ?? 0,
      icon: CalendarDays,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      comparison: stats?.today?.comparison,
    },
    {
      title: "Today's Completed",
      value: stats?.completed?.count ?? 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      comparison: stats?.completed?.comparison,
    },
    {
      title: "This Week's Appointments",
      value: stats?.week?.count ?? 0,
      icon: CalendarIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      comparison: stats?.week?.comparison,
    },
    {
      title: "This Month's Appointments",
      value: stats?.month?.count ?? 0,
      icon: CalendarClock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      comparison: stats?.month?.comparison,
    },
  ];

  // Render Custom Skeleton
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <>
      {statsData.map((stat, index) => {
        // Determine trend icon and color
        const TrendIcon =
          stat.comparison?.trend === "up"
            ? ArrowUpRight
            : stat.comparison?.trend === "down"
            ? ArrowDownRight
            : Minus;
        const trendColor =
          stat.comparison?.trend === "up"
            ? "text-green-600"
            : stat.comparison?.trend === "down"
            ? "text-red-600"
            : "text-gray-500";

        return (
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
              {/* Comparison Section */}
              {stat.comparison && (
                <div className="flex items-center mt-4">
                  <TrendIcon className={`h-4 w-4 mr-1 ${trendColor}`} />
                  <span className={`text-sm font-medium ${trendColor}`}>
                    {stat.comparison.percentChange}%{" "}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    vs.{" "}
                    {stat.title.includes("Today")
                      ? "yesterday"
                      : stat.title.includes("Week")
                      ? "last week"
                      : stat.title.includes("Month")
                      ? "last month"
                      : "previous period"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default StatCard;

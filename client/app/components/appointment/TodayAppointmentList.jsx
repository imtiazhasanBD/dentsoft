import { parseTime } from "@/app/utils/date";
import { CalendarClock, CircleCheck, CircleSlash, Clock5 } from "lucide-react";
import TodayApptSkeleton from "../skeleton/TodayApptSkeleton";

const TodayAppointmentList = ({ todayAppointments }) => {
  
  if (todayAppointments === null) {
    return <TodayApptSkeleton />;
  }

   if (todayAppointments?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
       No upcoming appointments
      </div>
    )
  }

  return (
    <ul className="flex flex-col ml-18 border-l-2 border-blue-500 pl-4 py-2 space-y-8">
      {(todayAppointments || [])
        .sort((a, b) => parseTime(a.time) - parseTime(b.time))
        .map((appt) => (
          <li key={appt._id} className="group relative -ml-[23px]">
            {/* Time marker dot and line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white group-hover:bg-blue-700" />
            </div>

            {/* Time label */}
            <div className="absolute -left-2 -translate-x-[calc(100%+8px)] top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
              {appt.time}
            </div>

            {/* Appointment card */}
            <div className="flex justify-between items-center gap-4 pl-4 bg-gray-50 rounded-lg p-2 ml-8 border-gray-100 border">
              <div>
                <h3 className="font-semibold text-gray-900">{appt.name}</h3>
                <p className="text-sm text-muted-foreground">Follow-up</p>
                <p className="text-sm text-gray-600">{appt.phone}</p>
              </div>
              <div className="text-white text-sm">
                {(appt?.status === "completed" && (
                  <CircleCheck
                    size={20}
                    className="bg-green-400 rounded-full"
                  />
                )) ||
                  (appt?.status === "cancelled" && (
                    <CircleSlash
                      size={20}
                      className="bg-red-400 rounded-full"
                    />
                  )) || (
                    <Clock5 size={20} className="bg-blue-400 rounded-full" />
                  )}
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default TodayAppointmentList;

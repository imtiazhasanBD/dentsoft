import { formatDate, formatRelativeTime } from "@/app/utils/date";
import { Calendar, Clock } from "lucide-react";
import ApptListSkeleton from "../skeleton/ApptListSkeleton";

export default function AppointmentList({emptyMessage, appointments, scrollable}) {
  
  if (appointments === null) {
    return (
        <ApptListSkeleton/>
    );
  }

   if (appointments?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      className={`space-y-3 ${
        scrollable ? "max-h-[510px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" : ""
      }`}
    >
      {appointments?.map((appointment) => (
        <div
          key={appointment._id}
          className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <p className="font-medium">{appointment.name}</p>
            <p className="text-sm text-muted-foreground">Follow-up</p>
            <div className="flex items-center mt-2 gap-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(appointment.date)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {appointment.time}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatRelativeTime(appointment.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}

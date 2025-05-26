import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteAppointment } from "./DeleteAppointment";
import { EditAppointmentDialog } from "./EditAppointmentDialog";

export function AppointmentRow({ appt }) {
  return (
    <TableRow>
      <TableCell>{appt.name}</TableCell>
      <TableCell>{appt.phone}</TableCell>
      <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
      <TableCell>{appt.time}</TableCell>
      <TableCell>
        <TableCell>
          <Badge
            variant={
              appt.status === "completed"
                ? "success"
                : appt.status === "cancelled"
                ? "destructive"
                : "outline"
            }
          >
            {appt.status}
          </Badge>
        </TableCell>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-end items-center">
          {/* Tooltip for Add Patient */}
          {!appt.patientId && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex gap-1 cursor-pointer text-green-500">
                    <UserPlus className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Register as Patient</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Tooltip for Edit */}
          <TooltipProvider>
            <Tooltip>
              <EditAppointmentDialog appointment={appt} />
            </Tooltip>
          </TooltipProvider>

          {/* Tooltip for Delete */}
          <TooltipProvider>
            <Tooltip>
              <DeleteAppointment appointmentId={appt._id} />
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

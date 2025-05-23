import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex gap-2 justify-end">
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
              <TooltipTrigger asChild>
                <button
                  className="cursor-pointer text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Tooltip for Delete */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-red-600"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 cursor-pointer" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

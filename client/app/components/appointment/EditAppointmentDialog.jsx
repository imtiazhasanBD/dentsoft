"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DateTimePickerDialog from "./create-appt/DateTimePicker";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export function EditAppointmentDialog({ appointment }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [date, setDate] = useState(new Date(appointment.date));
  const [formData, setFormData] = useState({
    patientId: appointment.patientId,
    name: appointment.name,
    phone: appointment.phone,
    time: appointment.time,
    status: appointment.status,
  });

  useEffect(() => {
    if (!isEditOpen) {
      setFormData({
        patientId: appointment.patientId,
        name: appointment.name,
        phone: appointment.phone,
        time: appointment.time,
        status: appointment.status,
      });
    }
  }, [isEditOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ...formData, date: format(date, "yyyy-MM-dd") });
    try {
      const res = axios.put(
        `${process.env.NEXT_PUBLIC_APPOINTMENT}/${appointment._id}`,
        { ...formData, date: format(date, "yyyy-MM-dd") },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      await toast.promise(res, {
        loading: "Updating appointment...",
        success: "Appointment updated successfully!",
        error: (err) => {
          return (
            <b>
              {err.response?.data?.error || "Could not create appointment."}
            </b>
          );
        },
      });
      setIsEditOpen(false);
      setFormData({
        patientId: appointment.patientId,
        name: appointment.name,
        phone: appointment.phone,
        time: appointment.time,
        status: appointment.status,
      });
    } catch (error) {
      console.error("Unexpected error after toast.promise:", error);
    }
  };

  const isPastDate = new Date(appointment.date) < new Date();
  const isCompleted = appointment.status === "completed";
  const isDisabled = isPastDate || isCompleted;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => !isDisabled && setIsEditOpen(true)}
            className={`cursor-pointer ${
              isDisabled ? "text-gray-400" : "text-blue-600"
            }`}
            disabled={isDisabled}
          >
            <Edit className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {/*  disable the edit button based on past dates or "completed" status*/}
          {isDisabled
            ? isPastDate
              ? "Can't edit past appointments"
              : "Completed appointments can't be edited"
            : "Edit"}
        </TooltipContent>
      </Tooltip>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={!!formData.patientId} // Disable if patientId exists
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={!!formData.patientId} // Disable if patientId exists
            />
            <DateTimePickerDialog
              date={date}
              setDate={setDate}
              time={formData.time}
              setTime={(t) => setFormData({ ...formData, time: t })}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className={"cursor-pointer"}
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className={"bg-blue-700 hover:bg-blue-600 cursor-pointer"}>Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

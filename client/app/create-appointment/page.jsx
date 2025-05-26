"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "../lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PatientSearch } from "../components/appointment/create-appt/PatientSearch";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import axios from "axios";
import DateTimePickerDialog from "../components/appointment/create-appt/DateTimePicker";
import { getTomorrow } from "../utils/date";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function CreateAppointment() {
  const [isNewPatient, setIsNewPatient] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: undefined, 
      name: "",
      phone: "",
      date: getTomorrow(),
      time: "",
      reason: "",
    },
  });

  const handlePatientSelect = (patient) => {
    form.setValue("patientId", patient.patientId); 
    form.setValue("name", patient.name); 
    form.setValue("phone", patient.phone);
  };

  const isPatient = () => {
    setIsNewPatient(!isNewPatient);
    form.reset({
      patientId: undefined,
      name: "",
      phone: "",
      date: getTomorrow(),
      time: "",
      reason: "",
    });
  };

  const onSubmit = async (data) => {

    try {
      const res = axios.post(process.env.NEXT_PUBLIC_APPOINTMENT, data, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      await toast.promise(res, {
        loading: "Creating appointment...",
        success: "Appointment created successfully!",
        error: (err) => {
          return (
            <b>
              {err.response?.data?.error || "Could not create appointment."}
            </b>
          );
        },
      });
      form.reset({
        patientId: undefined, 
        name: "",
        phone: "",
        date: getTomorrow(),
        time: "",
        reason: "",
      });
    } catch (error) {
      console.error("Unexpected error after toast.promise:", error);
    }
  };

  return (
    <div className="space-y-10">
      <div className=" flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Create Appointment
          </h1>
          <p className="text-muted-foreground">
            Enter the details for a new booking
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white p-2 rounded-sm font-medium cursor-pointer flex gap-1 items-center"
        >
          <ArrowLeft size={20} />
          Back to dashboard
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="w-full flex justify-end items-end">
          <Button
            className={
              "bg-transparent text-black hover:bg-white hover:text-blue-500 cursor-pointer"
            }
            onClick={isPatient}
          >
            {`${
              !isNewPatient
                ? " New Patient? Create Appointment"
                : " Exsting Patient? Create Appointment"
            }`}
          </Button>
        </div>
        {!isNewPatient ? (
          <div className="space-y-4 mb-6">
            <PatientSearch onSelect={handlePatientSelect} />
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isNewPatient && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ali Hasan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className={"w-full"}>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePickerDialog
                      date={field.value}
                      setDate={field.onChange}
                      time={form.watch("time")}
                      setTime={(t) => form.setValue("time", t)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief reason for visit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className={"bg-blue-600 hover:bg-blue-700"}>
              Confirm Appointment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

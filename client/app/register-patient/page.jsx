"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { patientFormSchema } from "../lib/schemas";

// Default values for the form fields
const defaultValues = {
  name: "",
  age: undefined,
  phone: "",
  blood_group: undefined,
  gender: undefined,
  address: "",
};

const AddPatientPage = () => {
  const form = useForm({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const responsePromise = axios.post(
        `http://localhost:5000/api/patients`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      await toast.promise(responsePromise, {
        loading: "Creating patient...",
        success: (res) => {
          console.log("Patient created successfully:", res.data);
          form.reset(defaultValues);
          return `Patient "${res.data.patient.name}" added! ID: ${res.data.patient.patientId}`;
        },
        error: (err) => {
          console.error("Error creating patient:", err);
        },
      });
    } catch (error) {
      console.error("An unexpected error occurred during submission:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const router = useRouter();
  return (
    <div className="s space-y-10">
      <div className=" flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Add New Patient</h1>
          <p className="text-muted-foreground">
            Enter the patient's details to create a new account.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button className="bg-blue-500 text-white p-2 rounded-sm font-medium cursor-pointer flex gap-1 items-center">
            All Patinet
          </button>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white p-2 rounded-sm font-medium cursor-pointer flex gap-1 items-center"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
      <Card className="w-full border-none">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-10 mt-4"
            >
              <div className="grid grid-cols-3 gap-8">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Patient Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Age Field */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Age
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Age"
                          {...field}
                          value={
                            field.value === undefined || field.value === null
                              ? ""
                              : String(field.value)
                          }
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Blood Group Field */}
                <FormField
                  control={form.control}
                  name="blood_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select Blood Group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender Field */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Address"
                        className="resize-y min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Patient..." : "Add Patient"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPatientPage;

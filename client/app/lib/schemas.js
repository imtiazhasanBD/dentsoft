import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["doctor", "receptionist"])
});


export const appointmentSchema = z.object({
  patientId: z.string().optional(), // For existing patients
  name: z.string().min(3, "Name too short"),
  phone: z.string().regex(/^\d{11}$/, "Phone must be 11 digits"),
  date: z.date(),
  time: z.string().nonempty("Time is required."),
  reason: z.string().min(5, "Reason too short")
});

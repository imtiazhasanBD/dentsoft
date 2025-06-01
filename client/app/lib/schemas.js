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


export const patientFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .trim(),
  age: z.coerce
    .number()
    .min(0, "Age cannot be negative.")
    .max(120, "Age seems too high.")
    .int("Age must be a whole number."),
  blood_group: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      required_error: "Please select a blood group.",
    })
    .optional(),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender.",
  }),
  phone: z
    .string()
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits."),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters.")
    .max(250, "Address cannot exceed 250 characters.")
    .optional()
    .or(z.literal("")),
});
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(cors());
const connectDB = require("./config/db");

app.use(express.json());
dotenv.config();
connectDB();


// Auth Route
const authRoutes = require("./routes/authRoutes");
app.use(process.env.AUTH_PATH, authRoutes);

// Appointment routes
const appointmentRoutes = require("./routes/appointmentRoutes")
app.use(process.env.APPOINTMENT_PATH, appointmentRoutes);

// Patients routes
const PatientRoutes = require("./routes/patientRoutes")
app.use(process.env.PATIENT_PATH, PatientRoutes);

// Patients Treatments routes
const PatientTreatmentsRoutes = require("./routes/treatments")
app.use(process.env.PATIENT_PATH, PatientTreatmentsRoutes);

// Patients Prescriptions routes
const PatientPrescriptionRoutes = require("./routes/prescriptionRoute")
app.use(`${process.env.PATIENT_PATH}/prescription`, PatientPrescriptionRoutes);

// Patients invoices routes
const PatientInvoicesRoutes = require("./routes/invoices")
app.use(`${process.env.PATIENT_PATH}/invoices`, PatientInvoicesRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
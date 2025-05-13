const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, default: null },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled"
  },
  reason: String
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;

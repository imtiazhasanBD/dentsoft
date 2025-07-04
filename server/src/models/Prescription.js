const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  treatmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Treatment" },
  toothNumbers: [String],
  problems: [String],
  advice: [String],
  tests: [String],
  medicines: [{
    id: String,
    name: String,
    mealTiming: String,
    duration: String,
    frequency: String
  }],
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;

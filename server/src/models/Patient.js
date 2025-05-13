const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {type: String, unique: true, required: true},
    name: String,
    age: Number,
    gender: String,
    phone: String,
    address: String,
    visits: [
      {
        date: { type: Date, default: Date.now },
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
        prescription: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prescription",
        },
        invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
      },
    ],
    financials: {
      totalPaid: { type: Number, default: 0 },
      totalDue: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;

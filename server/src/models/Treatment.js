const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
    patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  toothNumbers: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["planned", "in-progress", "completed", "cancelled"],
    default: "planned",
  },
  toothSpecificDetails: [
    {
      toothNumber: String,
      chiefComplaint: [String],
      clinicalFindings: [String],
      diagnosis: [String],
      procedure: [String],
      treatmentPlan: String,
      notes: String,
      cost: Number,
    },
  ],
   totalCost: {
    type: Number,
    default: 0,
    min: 0
  },
   totalPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: String,
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
  },
});

const Treatment = mongoose.model("Treatment", treatmentSchema);
module.exports = Treatment;

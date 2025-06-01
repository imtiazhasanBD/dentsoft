const mongoose = require("mongoose");
const Counter = require("./Counter");

const patientSchema = new mongoose.Schema(
  {
    patientId: {type: String, unique: true, index:true},
    name: String,
    age: Number,
    phone: String,
    blood_group: String,
    gender: String,
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

// Pre-save hook to generate patientId
patientSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'patientId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.patientId = 'P' + String(counter.seq).padStart(3, '0');
    next();
  } catch (err) {
    next(err);
  }
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;

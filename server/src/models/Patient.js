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
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'prefer-not-to-say']
    },
    medicalHistory: {
      allergies: [String],
      conditions: [String],
      medications: [String],
      previousDentalWork: [String],
      notes: String
    },
    teeth: {
      type: Map,
      of: new mongoose.Schema({
        status: {
          type: String,
          enum: ['healthy', 'in-progress', 'completed', 'extracted', 'requires-treatment'],
          default: 'healthy'
        },
        treatments: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Treatment'
        }],
        notes: String
      }),
      default: {}
    },
    treatments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Treatment'
    }],
    appointments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    }],
    prescriptions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription'
    }],
    xrays: [{
      date: Date,
      type: {
        type: String,
        enum: ['periapical', 'bitewing', 'panoramic', 'cephalometric', 'cbct']
      },
      url: String,
      teeth: [String],
      notes: String
    }],
    financials: {
      totalPaid: {
        type: Number,
        default: 0
      },
      totalDue: {
        type: Number,
        default: 0
      },
      outstandingBills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
      }]
    },
    notes: [{
      date: {
        type: Date,
        default: Date.now
      },
      content: String,
      tags: [String]
    }],
    visits: [{
      date: {
        type: Date,
        default: Date.now
      },
      purpose: String,
      treatment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treatment'
      },
      appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
      },
      prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
      },
      invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
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

// Initialize teeth map on new patient
patientSchema.pre('save', function(next) {
  if (this.isNew && !this.teeth.size) {
    const teethMap = {};
    // Permanent teeth (FDI numbering)
    for (let i = 11; i <= 18; i++) teethMap[i] = { status: 'healthy' };
    for (let i = 21; i <= 28; i++) teethMap[i] = { status: 'healthy' };
    for (let i = 31; i <= 38; i++) teethMap[i] = { status: 'healthy' };
    for (let i = 41; i <= 48; i++) teethMap[i] = { status: 'healthy' };
    this.teeth = teethMap;
  }
  next();
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  treatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment'
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "mobile", "insurance", "bank-transfer"],
    default: "cash",
  },
  type: {
    type: String,
    enum: ["consultation", "treatment", "medication", "other"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "partial", "unpaid", "refunded"],
    default: "unpaid"
  },
  notes: {
    type: String,
    default: ""
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
}); 

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
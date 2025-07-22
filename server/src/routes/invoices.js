const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const authMiddleware = require("../middleware/authMiddleware");
const getInvoice = require("../middleware/getInvoiceMiddleware");
const Patient = require("../models/Patient");
const Treatment = require("../models/Treatment");

// GET all invoices
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("patientId", "name patientId phone")
      .sort({ date: -1 }); // Sort by date descending
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single invoice
router.get("/:id", authMiddleware, getInvoice, (req, res) => {
  res.json(res.invoice);
});

// GET all invoices for a specific patient
router.get("/patient/:patientId", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ patientId: req.params.patientId })
      .populate("patientId", "name patientId phone")
      .populate("treatment")
      .sort({ createdAt: -1 });

    if (invoices.length === 0) {
      return res
        .status(404)
        .json({ message: "No invoices found for this patient" });
    }
    res.json(invoices);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }
    res.status(500).json({ message: err.message });
  }
});

// CREATE an invoice
// In your bill creation route/controller
router.post('/', async (req, res) => {
  try {
    const { patientId, treatment: treatmentId, amount } = req.body;
    
    // For consultation fees
    if (req.body.description === "Consultation Fee") {
      const invoice = await Invoice.create({
        ...req.body,
        type: 'consultation',
        paymentStatus: 'paid'
      });

      await Patient.findByIdAndUpdate(patientId, {
        $inc: { 'financials.totalPaid': amount },
        $push: { 'financials.outstandingBills': invoice._id }
      });

      return res.status(201).json(invoice);
    }

    // For treatment payments
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) throw new Error('Treatment not found');

    // Validate payment amount
    const remainingDue = treatment.totalCost - treatment.totalPaid;
    if (amount > remainingDue) {
      throw new Error(`Maximum allowed payment: $${remainingDue.toFixed(2)}`);
    }

    const invoice = await Invoice.create({
      ...req.body,
      type: 'treatment',
      paymentStatus: amount >= remainingDue ? 'paid' : 'partial'
    });

    // Update treatment and patient financials
    await Treatment.findByIdAndUpdate(treatmentId, {
      $inc: { totalPaid: amount },
      status: amount >= remainingDue ? 'completed' : 'in-progress'
    });

    await Patient.findByIdAndUpdate(patientId, {
      $inc: {
        'financials.totalPaid': amount,
        'financials.totalDue': -amount
      },
      $push: { 'financials.outstandingBills': invoice._id }
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE an invoice
router.put("/:id", authMiddleware, getInvoice, async (req, res) => {
  const { treatment, date, amount, paymentMethod } = req.body;

  // Update fields if they are provided in the request body
  if (treatment != null) res.invoice.description = treatment;
  if (date != null) res.invoice.date = date;
  if (amount != null) {
    if (typeof amount !== "number" || amount < 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a non-negative number." });
    }
    res.invoice.amount = amount;
  }
  if (paymentMethod != null) {
    if (!["cash", "card", "mobile"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method." });
    }
    res.invoice.paymentMethod = paymentMethod;
  }
  try {
    const updatedInvoice = await res.invoice.save();
    // Re-populate patient/appointment details after update if needed
    const populatedInvoice = await Invoice.findById(updatedInvoice._id)
      .populate("patientId", "name patientId phone")
      .populate("appointmentId");
    res.json(populatedInvoice);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE an invoice
router.delete("/:id", authMiddleware, getInvoice, async (req, res) => {
  try {
    await res.invoice.deleteOne(); // Use deleteOne() on the document instance
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

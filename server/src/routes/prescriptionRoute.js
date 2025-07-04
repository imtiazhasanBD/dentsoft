const express = require("express");
const Prescription = require("../models/Prescription");
const authMiddleware = require("../middleware/authMiddleware");
const Patient = require("../models/Patient");
const Treatment = require("../models/Treatment");

const router = express.Router();

// Create a new prescription
router.post("/", authMiddleware, async (req, res) => {
  const { patientId, treatmentId } = req.body;
console.log(treatmentId);

  try {
    const prescription = new Prescription(req.body);
    await prescription.save();

    await Patient.findByIdAndUpdate(patientId, {
      $push: { prescriptions: prescription._id },
    });

    await Treatment.findByIdAndUpdate(treatmentId, {
      $push: { prescriptions: prescription._id },
    });

    res.status(201).json({ prescription, message: "Prescription created successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all prescriptions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patientId")
      .populate("appointmentId")
      .populate("treatmentId");
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific prescription by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patientId")
      .populate("appointmentId")
      .populate("treatmentId");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get prescriptions by patient ID
router.get("/patient/:patientId", authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId,
    })
      .populate("patientId")
      .populate("appointmentId")
      .populate("treatmentId");

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a prescription
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("patientId")
      .populate("appointmentId")
      .populate("treatmentId");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a prescription
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

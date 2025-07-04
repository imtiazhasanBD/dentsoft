const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new patient 
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patientId, name, age, gender, blood_group, phone, address } = req.body;

    const exists = await Patient.findOne({ patientId});
    
    if (exists) {
      return res.status(400).json({ message: "Patient ID already exists" });
    }

    const patient = await Patient.create({
      patientId,
      name,
      age,
      phone,
      gender,
      blood_group,
      address,
    });

    res.status(201).json({ patient, message: "Patient created successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all patients 
router.get("/", authMiddleware, async (req, res) => {
    const { search } = req.query
  try {
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search } },
      ];
    }
    const patients = await Patient.find().sort({ name: 1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get a single patient by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id})
     .populate("treatments")
     .populate("prescriptions")
     
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a patient
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Patient.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ message: "Patient not found or not authorized" });
    res.json({ updated, message: "Patient updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a patient
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Patient.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Patient not found or not authorized" });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const Treatment = require("../models/Treatment");
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/:patientId/treatments', authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { totalCost } = req.body;
    console.log(patientId);
    
    const treatmentData = {
      ...req.body,
      patient: patientId,
      date: req.body.date || Date.now()
    };

    // Validate tooth numbers
    const validTeeth = /^[1-8][1-8]$|^[1-5][1-5]$/; // FDI numbering validation
    if (treatmentData.toothNumbers.some(t => !validTeeth.test(t))) {
      return res.status(400).json({ error: 'Invalid tooth numbers' });
    }

    const treatment = await Treatment.create(treatmentData);
    
    // Update patient's teeth status
    await Patient.findByIdAndUpdate(
      patientId,
      { 
        $push: { treatments: treatment._id },
        $set: treatmentData.toothNumbers.reduce((acc, tooth) => ({
          ...acc,
          [`teeth.${tooth}.status`]: treatmentData.status,
          [`teeth.${tooth}.treatments`]: treatment._id
        }), {}),
        $inc: { 'financials.totalDue': totalCost }
      }
    );

    res.status(201).json({ treatment, message: "Treatment created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Update a Treatment
router.put("/treatment/:id", authMiddleware, async (req, res) => {
  console.log(req.params.id);
  
  try {
    const updated = await Treatment.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ message: "Treatment not found" });
    res.json({ updated, message: "Treatment updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all treatments 
router.get("/treatments/all", async (req, res) => {
  try {
    const treatments = await Treatment.find();
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
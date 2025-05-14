const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const availableSlots = require("../utils/availableSlots");
const checkAvailability = require("../middleware/checkAvailability");
const formatTime = require("../utils/formatTime");

// Create appointment
router.post("/", authMiddleware, checkAvailability, async (req, res) => {
  try {
    const { patientId, name, phone, email, date, time, reason } = req.body;

    let appointmentData = { date, time: formatTime(time), reason };

    if (!date || !time) {
      return res
        .status(400)
        .json({ message: "Date and time fields are required." });
    }

    // for valid time slot
    const isValidSlot = availableSlots(date, formatTime(time));
    if (!isValidSlot) {
      return res.status(400).json({ error: "Select a valid time slot" });
    }
    console.log(isValidSlot);

    // Case 1: Direct booking with patientId
    if (patientId) {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      appointmentData.patientId = patient.patientId;
      appointmentData.name = patient.name;
      appointmentData.phone = patient.phone;
    }
    // Case 2: Check existing patient by phone
    else if (phone) {
      const patient = await Patient.findOne({
        $or: [{ phone }],
      });

      if (patient) {
        appointmentData.patientId = patient.patientId;
        appointmentData.name = patient.name; // Use DB name
        appointmentData.phone = patient.phone; // Use DB phone
      } else {
        // Case 3: General person (store as-is)
        appointmentData.name = name;
        appointmentData.phone = phone;
      }
    }
    //  Invalid request
    else {
      return res.status(400).json({
        error: "Provide either patientId or name/phone",
      });
    }

    const appointment = await Appointment.create(appointmentData);
    res
      .status(201)
      .json({ appointment, message: "Appointment created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all appointments (optionally by date/name/others)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, ...query } = req.query;
    const skip = (page - 1) * limit;

    // Case-insensitive search for name field
    if (query.name) {
      query.name = { $regex: query.name, $options: "i" };
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: 1 }), // Sort by appointment date
      Appointment.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        resultsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// Update appointment status
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ appt, message: "Appointment updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete/Cancel appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

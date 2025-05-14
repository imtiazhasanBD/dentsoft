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



module.exports = router;

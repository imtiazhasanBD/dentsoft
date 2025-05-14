const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const formatTime = require("../utils/formatTime");

const checkAvailability = async (req, res, next) => {
  try {
    const { date, time, patientId, name, phone } = req.body;

    // check phone number associated with existing patients
    if (phone) {
      const patient = await Patient.findOne({phone});
      if (patient && patient?.name !== name) {
        return res.status(400).json({
          error:
            "Provide another number. This number is associated with another patient",
        });
      }
    }

    // 1. Check patient appointment limits
    if (patientId) {
      // Existing patient - check by ID
      const existingAppointment = await Appointment.findOne({
        patientId,
        date,
      });
      if (existingAppointment) {
        return res.status(400).json({
          error: "Patient already has an appointment on this date",
        });
      }
    }

    // 2. Non patient - check by name AND phone
    const existingAppointment = await Appointment.findOne({
      name,
      phone,
      date,
    });

    if (existingAppointment) {
      return res.status(400).json({
        error:
          "An appointment already exists for this name and phone on this date",
      });
    }

    // 3. Check if timeslot is already booked
    else {
      const existingSlot = await Appointment.findOne({
        date,
        time: formatTime(time),
      });
      if (existingSlot) {
        return res.status(400).json({
          error: "This timeslot is already booked",
        });
      }
    }

    next(); // All checks passed
  } catch (err) {
    res.status(500).json({ error: "Availability check failed" });
  }
};

module.exports = checkAvailability;

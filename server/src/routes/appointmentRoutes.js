const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const availableSlots = require("../utils/availableSlots");
const checkAvailability = require("../middleware/checkAvailability");
const formatTime = require("../utils/formatTime");
const { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } = require('date-fns');
const { parseISO } = require("date-fns/parseISO");
const allTimeSlots = require("../utils/allTimeSlots");
const calculateComparison = require("../utils/calculateComparison");

// Create appointment
router.post("/", authMiddleware, checkAvailability, async (req, res) => {
  try {
    const { patientId, name, phone, email, date, time, reason } = req.body;

    let appointmentData = {
      date: format(date, "yyyy-MM-dd"),
      time: formatTime(time),
      reason,
    };

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
    console.log(patientId);

    // Case 1: Direct booking with patientId
    if (patientId) {
      const patient = await Patient.findOne({ _id: patientId });
      console.log(patient);

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
    // Emit to all clients
    req.app.get("io").emit("appointment:created", appointment);
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
    if (query.phone) {
      query.phone = { $regex: query.phone, $options: "i" }; // Phone search (new)
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ date: -1 }), // Sort by appointment date
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

// Get all appointments stats count with comparisons
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    // --- All Queries ---
    const [
      // Current Period Counts
      todayCount,
      completedTodayCount,
      weekCount,
      monthCount,

      // Previous Period Counts
      yesterdayCount,
      completedYesterdayCount,
      lastWeekCount,
      lastMonthCount,
    ] = await Promise.all([
      // 1. Today's appointment count
      Appointment.countDocuments({
        date: {
          $gte: format(startOfDay(now), "yyyy-MM-dd"),
          $lte: format(endOfDay(now), "yyyy-MM-dd"),
        },
      }),

      // 2. Total completed appointments for today
      Appointment.countDocuments({
        status: "completed",
        date: {
          $gte: format(startOfDay(now), "yyyy-MM-dd"),
          $lte: format(endOfDay(now), "yyyy-MM-dd"),
        },
      }),

      // 3. This week's appointment count
      Appointment.countDocuments({
        date: {
          $gte: format(startOfWeek(now), "yyyy-MM-dd"),
          $lte: format(endOfWeek(now), "yyyy-MM-dd"),
        },
      }),

      // 4. This month's appointment count
      Appointment.countDocuments({
        date: {
          $gte: format(startOfMonth(now), "yyyy-MM-dd"),
          $lte: format(endOfMonth(now), "yyyy-MM-dd"),
        },
      }),

  // 5. Yesterday's appointment count
      Appointment.countDocuments({
        date: {
          $gte: format(startOfDay(subDays(now, 1)), "yyyy-MM-dd"),
          $lte: format(endOfDay(subDays(now, 1)), "yyyy-MM-dd"),
        },
      }),

  // 6. Total completed appointments for yesterday
      Appointment.countDocuments({
        status: "completed",
        date: {
          $gte: format(startOfDay(subDays(now, 1)), "yyyy-MM-dd"),
          $lte: format(endOfDay(subDays(now, 1)), "yyyy-MM-dd"),
        },
      }),

  // 7. Last week's appointment count
      Appointment.countDocuments({
        date: {
          $gte: format(startOfWeek(subWeeks(now, 1)), "yyyy-MM-dd"),
          $lte: format(endOfWeek(subWeeks(now, 1)), "yyyy-MM-dd"),
        },
      }),

   // 8. Last month's appointment count
      Appointment.countDocuments({
        date: {
          $gte: format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd"),
          $lte: format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd"),
        },
      }),
    ]);

    // --- Calculate Comparisons ---
    const todayComparison = calculateComparison(todayCount, yesterdayCount);
    const completedComparison = calculateComparison(
      completedTodayCount,
      completedYesterdayCount
    );
    const weekComparison = calculateComparison(weekCount, lastWeekCount);
    const monthComparison = calculateComparison(monthCount, lastMonthCount);

    res.json({
      stats: {
        today: {
          count: todayCount,
          comparison: todayComparison,
        },
        completed: {
          count: completedTodayCount,
          comparison: completedComparison,
        },
        week: {
          count: weekCount,
          comparison: weekComparison,
        },
        month: {
          count: monthCount,
          comparison: monthComparison,
        },
      },
      success: true,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res
      .status(500)
      .json({ message: "Failed to get statistics", error: error.message });
  }
});

// Get all today & latest appointments
router.get("/tl", authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    const [todayAppointments, latestAppointments] = await Promise.all([
      // today appointments
      Appointment.find({
        date: {
          $gte: format(startOfDay(now), "yyyy-MM-dd"),
          $lte: format(endOfDay(now), "yyyy-MM-dd"),
        },
      }),

      // Latest 5 appointments
      Appointment.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      todayAppointments,
      latestAppointments,
      success: true,
    });
  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(500).json({ message: "Failed to get appointments", error });
  }
});

// check available appointment time slots
router.get("/available", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const day = parseISO(date);

    const appointments = await Appointment.find({
      date: {
        $gte: format(startOfDay(day), "yyyy-MM-dd"),
        $lte: format(endOfDay(day), "yyyy-MM-dd"),
      },
    });

    const bookedTimes = appointments.map((a) => a.time); // assumes time = "HH:MM AM/PM"
    console.log(bookedTimes);

    const availableSlots = allTimeSlots(date).filter(
      (slot) => !bookedTimes.includes(slot)
    );

    res.json({ date, availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update appointment status
router.put("/:id", authMiddleware, checkAvailability, async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get("io").emit("appointment:updated", updated);
    res.json({ updated, message: "Appointment updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete/Cancel appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const removed = await Appointment.findByIdAndDelete(req.params.id);
    req.app.get("io").emit("appointment:deleted", removed._id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

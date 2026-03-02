const express = require("express");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// View available slots for professor
router.get("/availability/:professorId", auth(["student"]), async (req, res) => {
  try {
    const availability = await Availability.find({
      professor: req.params.professorId
    });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book appointment
router.post("/book", auth(["student"]), async (req, res) => {
  try {
    const { professorId, date, time } = req.body;

    const availability = await Availability.findOne({
      professor: professorId,
      date
    });

    if (!availability)
      return res.status(400).json({ message: "No availability found" });

    const slot = availability.slots.find(s => s.time === time);

    if (!slot || slot.isBooked)
      return res.status(400).json({ message: "Slot not available" });

    slot.isBooked = true;
    await availability.save();

    const appointment = await Appointment.create({
      professor: professorId,
      student: req.user.id,
      date,
      time
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student checks own appointments
router.get("/my-appointments", auth(["student"]), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      student: req.user.id,
      status: "booked"
    }).populate("professor", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
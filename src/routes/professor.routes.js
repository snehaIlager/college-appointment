const express = require("express");
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// Professor sets availability
router.post("/availability", auth(["professor"]), async (req, res) => {
  try {
    const { date, slots } = req.body;

    const availability = await Availability.create({
      professor: req.user.id,
      date,
      slots
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Professor cancels appointment
router.put("/cancel/:appointmentId", auth(["professor"]), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
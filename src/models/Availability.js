const mongoose = require("mongoose");

// Each professor can define availability per date
const availabilitySchema = new mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  slots: [
    {
      time: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }
  ]
});

module.exports = mongoose.model("Availability", availabilitySchema);
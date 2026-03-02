const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const professorRoutes = require("./routes/professor.routes");
const studentRoutes = require("./routes/student.routes");

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/student", studentRoutes);

module.exports = app;
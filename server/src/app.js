const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(cors());
const connectDB = require("./config/db");

app.use(express.json());
dotenv.config();
connectDB();


// Auth Route
const authRoutes = require("./routes/authRoutes");
app.use(process.env.AUTH_PATH, authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

module.exports = app;
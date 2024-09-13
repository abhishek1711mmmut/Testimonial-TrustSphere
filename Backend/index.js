const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/Auth");
const testimonialRoutes = require("./routes/Testimonial");
const adminRoutes = require("./routes/Admin");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Initialize the app
const app = express();

// Middleware setup
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable CORS for all origins

// Connect to MongoDB
connectDB;

// Routes mounting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/testimonial", testimonialRoutes);
app.use("/api/v1/admin", adminRoutes);

// Home route
app.get("/", (req, res) => {
  res.send(
    "<i><h2>Why you are accessing this route?</h2></i>" +
      "<i>Anyway, Welcome vro! You have successfully accessed the homepage of the testimonial backend.</i>"
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

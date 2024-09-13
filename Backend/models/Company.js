const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    testimonials: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Testimonial" },
    ],
    role: {
      type: String,
      enum: ["admin", "company"], // Enum for role
      default: "company", // Default role for new users
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);

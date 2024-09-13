const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: String }, // Optional customer photo
    message: { type: String, required: true },
    rating: { type: Number, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure the combination of company and email is unique
TestimonialSchema.index({ company: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Testimonial", TestimonialSchema);

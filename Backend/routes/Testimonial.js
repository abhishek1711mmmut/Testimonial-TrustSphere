const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  generateLink,
  submitTestimonial,
  getCompanyTestimonial,
} = require("../controllers/Testimonial");

// Testimonial routes
router.post("/generate-link", auth, generateLink);
router.post("/submit/:companyId", submitTestimonial);
router.get("/get-testimonial", auth, getCompanyTestimonial);

module.exports = router;

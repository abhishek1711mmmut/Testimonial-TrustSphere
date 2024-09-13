const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");

const {
  generateLink,
  submitTestimonial,
  getCompanyTestimonial,
  deleteTestimonial,
} = require("../controllers/Testimonial");

// Testimonial routes
router.post("/generate-link", auth, generateLink);
router.post("/submit/:companyId", upload.single("file"), submitTestimonial);
router.get("/get-testimonial", auth, getCompanyTestimonial);
router.delete("/delete-testimonial/:testimonialId", auth, deleteTestimonial);

module.exports = router;

const Company = require("../models/Company");
const Testimonial = require("../models/Testimonial");

// Generate a unique link for testimonials
exports.generateLink = (req, res) => {
  const companyId = req.company._id;
  const link = `${req.protocol}://${req.get("host")}/submit/${companyId}`;
  res.json({
    success: true,
    link,
    message: "Testimonial link generated successfully",
  });
};

// Submit a testimonial
exports.submitTestimonial = async (req, res) => {
  const companyId = req.params.companyId;
  const { name, email, message, photo, rating } = req.body;
  try {
    if (!companyId || !name || !email || !message || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Create a new testimonial
    const newTestimonial = new Testimonial({
      name,
      email,
      message,
      photo,
      rating,
      company: companyId,
    });
    await newTestimonial.save();

    // Add testimonial to company
    await Company.findByIdAndUpdate(companyId, {
      $push: { testimonials: newTestimonial._id },
    });
    res.json({ success: true, message: "Testimonial submitted successfully" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A review with this email already exists for this company.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error submitting testimonial",
    });
  }
};

exports.getCompanyTestimonial = async (req, res) => {
  const companyId = req.company._id;
  try {
    const testimonials = await Testimonial.find({ company: companyId });

    if (!testimonials.length)
      return res.status(404).json({
        success: false,
        message: "No testimonials found for this company",
      });

    res.json({
      success: true,
      testimonials,
      message: "Testimonials fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching testimonials" });
  }
};

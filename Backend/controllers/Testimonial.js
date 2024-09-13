const Company = require("../models/Company");
const Testimonial = require("../models/Testimonial");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

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
  const { name, email, message, rating } = req.body;
  const file = req.file;
  try {
    if (!companyId || !name || !email || !message || !rating) {
      // Remove the file from local storage after upload
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Check if the email is already used by another testimonial
    const existingTestimonial = await Testimonial.findOne({
      email,
      company: companyId,
    });
    if (existingTestimonial) {
      // Remove the file from local storage after upload
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: "A review with this email already exists for this company.",
      });
    }

    // Upload the file to Cloudinary
    if (file) {
      const result = await cloudinary.uploader
        .upload(file.path, {
          resource_type: file.mimetype.startsWith("video") ? "video" : "image", // Specify resource type
          folder: "Testimonials",
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error uploading file",
          });
        });

      // Set media URL and type
      mediaUrl = result.secure_url;
      mediaType = file.mimetype.startsWith("video") ? "video" : "image";

      // Remove the file from local storage after upload
      fs.unlinkSync(file.path);
    }

    // Create a new testimonial
    const newTestimonial = new Testimonial({
      name,
      email,
      message,
      rating,
      company: companyId,
      mediaType,
      mediaUrl,
    });
    await newTestimonial.save();

    // Add testimonial to company
    await Company.findByIdAndUpdate(companyId, {
      $push: { testimonials: newTestimonial._id },
    });

    res.json({ success: true, message: "Testimonial submitted successfully" });
  } catch (err) {
    console.log(err);
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

exports.deleteTestimonial = async (req, res) => {
  const testimonialId = req.params.testimonialId;
  try {
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial)
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });

    await Testimonial.findByIdAndDelete(testimonialId);
    await Company.findByIdAndUpdate(testimonial.company, {
      $pull: { testimonials: testimonialId },
    });
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error deleting testimonial",
    });
  }
};

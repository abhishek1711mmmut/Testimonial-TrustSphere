const Company = require("../models/Company");
const Testimonial = require("../models/Testimonial");
const cloudinary = require("../config/cloudinary");

// Get a list of all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .select("-password") // Exclude passwords
      .where("role", "company");
    res.json({
      success: true,
      companies,
      message: "All companies fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching companies",
      error: err.message,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const company = await Company.findById(companyId);
    if (!company)
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });

    // Find all testimonials related to the company
    const testimonials = await Testimonial.find({ company: companyId });

    // Prepare an array of promises to delete each media file from Cloudinary
    const cloudinaryDeletionPromises = testimonials.map((testimonial) => {
      if (testimonial.mediaUrl) {
        const publicId = testimonial.mediaUrl.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`Testimonials/${publicId}`, {
          resource_type: testimonial.mediaType,
          invalidate: true,
        });
      }
      return Promise.resolve(); // If no mediaUrl, skip
    });

    // Wait for all Cloudinary deletion operations to complete
    await Promise.all(cloudinaryDeletionPromises);

    // Remove testimonials from the company
    await Testimonial.deleteMany({ company: companyId });

    // Remove company from the database
    await Company.findByIdAndDelete(companyId);
    res.json({ success: true, message: "Company deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error deleting company",
    });
  }
};

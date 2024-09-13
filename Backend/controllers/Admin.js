const Company = require("../models/Company");

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

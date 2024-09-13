const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

// Register a new company
exports.register = async (req, res) => {
  const { companyName, email, password, confirmPassword } = req.body;
  try {
    if (!companyName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Fill up All the Required Fields",
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const companyExists = await Company.findOne({ email });
    if (companyExists)
      return res
        .status(400)
        .json({ success: false, message: "Company already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = new Company({
      companyName,
      email,
      password: hashedPassword,
    });
    await newCompany.save();
    res
      .status(201)
      .json({ success: true, message: "Company registered successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Company cannot be registered. Please try again",
      error: err.message,
    });
  }
};

// Login a company
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validation data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill up All the Required Fields",
      });
    }
    const company = await Company.findOne({ email });

    if (!company)
      return res
        .status(400)
        .json({ success: false, message: "Company not registered" });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    company.password = undefined; // Remove password from response

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      success: true,
      token,
      company,
      message: "Login Successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
};

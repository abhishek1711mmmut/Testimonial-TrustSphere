const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

exports.auth = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = await Company.findById(decoded.id);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, msg: "Invalid token" });
  }
};

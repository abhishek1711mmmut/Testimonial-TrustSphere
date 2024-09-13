exports.admin = (req, res, next) => {
  if (req.company.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, msg: "Access denied: Admins only" });
  }
  next();
};

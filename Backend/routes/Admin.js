// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAllCompanies } = require("../controllers/Admin");
const { auth: authMiddleware } = require("../middlewares/auth");
const { admin: adminMiddleware } = require("../middlewares/admin");

// Only admin can access this route
router.get("/companies", authMiddleware, adminMiddleware, getAllCompanies);

module.exports = router;

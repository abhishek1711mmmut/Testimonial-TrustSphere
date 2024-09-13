const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log("DB Connection Failed");
    console.log(err);
    process.exit(1);
  });

module.exports = connectDB;

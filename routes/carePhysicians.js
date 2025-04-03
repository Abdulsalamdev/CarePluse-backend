const express = require("express");
const physicianRoutes = express.Router();
const multer = require("multer");
const dotenv = require("dotenv");
const { getPhysicians, createPhysician } = require("../controllers/carePhysician.controller");
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});
const upload = multer({ storage });

//creating physicians
physicianRoutes.post("/create-physician", upload.single("image"), createPhysician);

physicianRoutes.get("/physicians",getPhysicians);
module.exports = physicianRoutes;

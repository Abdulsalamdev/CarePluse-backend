const express = require("express");
const carePhysician = require("../model/carePhysician");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const dotenv = require("dotenv");
const { PORT } = process.env;
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
router.post("/create-physician", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file
      ? `http://localhost:${PORT}/uploads/${req.file.filename}`
      : null; // Create a full URL

    if (!filePath) {
      return res.status(400).send({ message: "File upload failed" });
    }

    const newCarePhysic = new carePhysician({
      fileName: req.file.filename,
      filePath: filePath,
    });

    await newCarePhysic.save();
    res.status(201).send({
      message: "Physician created successfully",
      data: { newCarePhysic },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/physicians", async (req, res) => {
  try {
    const physicians = await carePhysician.find().sort("name");

    res.status(200).send({ success: true, physicians });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
module.exports = router;

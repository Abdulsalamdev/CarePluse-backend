const express = require("express");
const { PatientValidator, Patient } = require("../model/patient");
const router = express.Router();
const multer = require("multer");
const dotenv = require("dotenv");
const { PORT } = process.env;
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file
  },
});
const upload = multer({ storage });

router.post("/patient-form/", upload.single("file"), async (req, res) => {
  try {
    const { error } = PatientValidator(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const filePath = req.file
      ? `http://localhost:${PORT}/uploads/${req.file.filename}`
      : null; // Create a full URL

    if (!filePath) {
      return res.status(400).send({ message: "File upload failed" });
    }

    const newPatientForm = new Patient({
      full_name: req.body.full_name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      occupation: req.body.occupation,
      emergency_contact_name: req.body.emergency_contact_name,
      emergency_contact_number: req.body.emergency_contact_number,
      date_Of_birth: req.body.date_Of_birth,
      gender: req.body.gender,
      medical_informations: {
        care_physician: req.body.care_physician,
        insurance_provider: req.body.insurance_provider,
        insurance_provider_number: req.body.insurance_provider_number,
        allergies: req.body.allergies,
        current_medication: req.body.current_medication,
        family_medical_history: req.body.family_medical_history,
        medical_history: req.body.medical_history,
      },
      identification_verification: {
        identification_type: req.body.identification_type,
        identification_number: req.body.identification_number,
        file: {
          fileName: req.file.filename,
          filePath: filePath,
        },
      },
      consent_privacy: {
        first_privacy: req.body.first_privacy,
        second_privacy: req.body.second_privacy,
        third_privacy: req.body.third_privacy,
      },
    });

    await newPatientForm.save();

    res
      .status(201)
      .send({ message: "Patient Form created successfully", newPatientForm });
  } catch (error) {
    console.error("Error saving patient:", error);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;

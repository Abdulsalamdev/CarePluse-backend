const express = require("express");
const patientRoutes = express.Router();
const { Auth } = require("../middleware/auth");
const { patientForm, appointmentForm } = require("../controllers/patient.controller");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Accept only certain file types (e.g., PDF and images)
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Error: File type not allowed!"));
    }
  },
});

// Creating patient Form
patientRoutes.post("/patient-form/", Auth, upload.single("file"), patientForm);

//  Creating Patient Appointment form
patientRoutes.post("/appointment-form", Auth, appointmentForm);

module.exports = patientRoutes;

const { Auth } = require("../middleware/auth");
const express = require("express");
const { Patient, PatientAppointment } = require("../model/patient");
const router = express.Router();

router.get("/admin/patient-data", Auth, async (req, res) => {
  try {
    const patientData = await PatientAppointment.find(
      {},
      { _id: 0, appointment_date: 1, appointment_status: 1, doctor: 1 }
    ).populate("patientId", "full_name");

    return res.status(200).send({ patientData });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;

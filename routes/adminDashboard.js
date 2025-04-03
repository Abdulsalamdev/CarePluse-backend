const { Auth } = require("../middleware/auth");
const express = require("express");
const {
  Patient,
  PatientAppointment,
  UpdateAppointmentValidator,
  CancleAppointmentValidator,
} = require("../model/patient");
const router = express.Router();
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

const { EMAIL, EMAIL_PASSWORD } = process.env;

// getting list of patient data
router.get("/patient-data", Auth, async (req, res) => {
  try {
    const patientData = await PatientAppointment.find(
      {},
      { _id: 0, appointment_date: 1, appointment_status: 1, doctor: 1 }
    )
      .populate("userId", "email")
      .populate("patientId", "full_name");

    // Count the occurrences of each appointment_status
    const counts = patientData.reduce((acc, appointment) => {
      const status = appointment.appointment_status.toLowerCase(); // normalize case
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).send({ patientData, counts });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Schedulling an Appointment
router.put("/schedule-appointment-status/:id", Auth, async (req, res) => {
  const appointmentId = req.params.id;
  const { doctor, appointment_date, appointment_reason, appointment_status } =
    req.body;
  try {
    const { error } = UpdateAppointmentValidator(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const updatedAppointment = await PatientAppointment.findByIdAndUpdate(
      appointmentId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAppointment)
      return res.status(404).send({ message: "Appointment not found" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      debug: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    return res.status(200).send({
      message: "Appointment has been successfully Schedule",
      updatedAppointment,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Cancling an Appointment
router.put("/cancle-appointment/:id", Auth, async (req, res) => {
  const appointmentId = req.params.id;
  const { appointment_reason, appointment_status } = req.body;
  try {
    const { error } = CancleAppointmentValidator(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const cancledAppointment = await PatientAppointment.findByIdAndUpdate(
      appointmentId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cancledAppointment)
      return res.status(404).send({ message: "Appointment not found" });

    return res
      .status(200)
      .send({ message: "Appointment has been successfully cancled" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
module.exports = router;


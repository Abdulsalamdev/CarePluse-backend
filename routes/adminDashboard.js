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

{
  /* <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Appointment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #dddddd;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #4caf50;
            color: white;
            padding: 10px 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }
        .content h2 {
            margin-top: 0;
            font-size: 22px;
            color: #333;
        }
        .appointment-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .appointment-details h3 {
            margin-top: 0;
            font-size: 18px;
            color: #4caf50;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f1f1f1;
            color: #777;
        }
        .footer a {
            color: #4caf50;
            text-decoration: none;
        }
        .btn {
            background-color: #4caf50;
            color: white;
            padding: 10px 20px;
            border: none;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Appointment Confirmation</h1>
        </div>
        <div class="content">
            <h2>Dear {{patient_name}},</h2>
            <p>We are pleased to confirm your upcoming appointment with us. Below are the details of your appointment:</p>
            <div class="appointment-details">
                <h3>Appointment Details</h3>
                <p><strong>Date:</strong> {{appointment_date}}</p>
                <p><strong>Time:</strong> {{appointment_time}}</p>
                <p><strong>Doctor:</strong> {{doctor_name}}</p>
              
            </div>
            <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
        </div>
        <div class="footer">
            <p>Thank you for choosing our clinic!</p>
            <p>If you have any questions, feel free to <a href="mailto:{{clinic_email}}">contact us</a>.</p>
        </div>
    </div>
</body>
</html> */
}

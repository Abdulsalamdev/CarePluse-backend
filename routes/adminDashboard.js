const { Auth } = require("../middleware/auth");
const express = require("express");
const adminRoutes = express.Router();
const { getPatients, schedulePatient, canclePatient } = require("../controllers/adminDashboard.controller");



// getting list of patient data
 adminRoutes.get("/patient-data", Auth,getPatients);

// Schedulling an Appointment
 adminRoutes.put("/schedule-appointment-status/:id", Auth,schedulePatient );

// Cancling an Appointment
 adminRoutes.put("/cancle-appointment/:id", Auth,canclePatient);
module.exports =  adminRoutes;


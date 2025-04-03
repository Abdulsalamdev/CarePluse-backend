const express =  require("express")
const indexRoutes = express.Router()
const physicianRoutes = require("../routes/carePhysicians")
const  adminRoutes = require("../routes/adminDashboard")
const patientRoutes = require("../routes/patients")
const userRoutes =  require("../routes/users")


indexRoutes.use("/", physicianRoutes)
indexRoutes.use("/", adminRoutes)
indexRoutes.use("/", patientRoutes)
indexRoutes.user("/", userRoutes)

module.exports = {
    indexRoutes
}
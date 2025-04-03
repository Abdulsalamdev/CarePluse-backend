const express =  require("express")
const indexRoutes = express.Router()
const physicianRoutes = require("../routes/carePhysicians")

indexRoutes.use("/", physicianRoutes)
module.exports = {
    indexRoutes
}
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const mongoose = require("mongoose");
const { PORT } = process.env;
const userRoutes = require("./routes/users");
const physicianRoutes = require("./routes/carePhysicians");
const patientRoutes = require("./routes/patients");

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Connected to MongoDb server");
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB server", err));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", patientRoutes);

app.use("/api", userRoutes);
app.use("/api", physicianRoutes);

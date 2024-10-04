const Joi = require("joi");
const mongoose = require("mongoose");

const carePhysicianSchema = new mongoose.Schema({
  fileName: String,
  filePath: {
    type: String,
    validate: {
      validator: function (v) {
        // Regex to validate image URLs (e.g., .jpg, .jpeg, .png, .gif)
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(v);
      },
      message: "Please provide a valid image URL",
    },
  },
});

const carePhysician = mongoose.model("carePhysician", carePhysicianSchema);

module.exports = carePhysician;

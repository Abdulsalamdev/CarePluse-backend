const carePhysician = require("../model/carePhysician");
const { PORT } = process.env;


const getPhysicians =  async (req, res) => {
    try {
      const physicians = await carePhysician.find().sort("name");
  
      res.status(200).send({ success: true, physicians });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  const createPhysician = async (req, res) => {
    try {
      const filePath = req.file
        ? `http://localhost:${PORT}/uploads/${req.file.filename}`
        : null; // Create a full URL
  
      if (!filePath) {
        return res.status(400).send({ message: "File upload failed" });
      }
  
      const newCarePhysic = new carePhysician({
        fileName: req.file.filename,
        filePath: filePath,
      });
  
      await newCarePhysic.save();
      res.status(201).send({
        message: "Physician created successfully",
        data: { newCarePhysic },
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }


  module.exports = {
    getPhysicians,
    createPhysician
  }
const physicianService = require("../services/physician.service")

const getPhysicians =  async (req, res) => {
    try {
  const physicians = await physicianService.getPhysicians()
      res.status(200).send({ success: true, physicians });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  const createPhysician = async (req, res) => {
    const {file} = req.file

    try {
const physician = await physicianService.createPhysician(file)
  
     
      res.status(201).send({
        message: "Physician created successfully",
        data: { physician },
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }


  module.exports = {
    getPhysicians,
    createPhysician
  }
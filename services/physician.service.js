const carePhysician = require("../model/carePhysician");
const { PORT } = process.env;

const getPhysicians = async () => {
    const physicians = await carePhysician.find().sort("name");

    return physicians
}

const createPhysician = async (data, file) => {
    const filePath = file
    ? `http://localhost:${PORT}/uploads/${file.filename}`
    : null; // Create a full URL
    if(!filePath) {
        throw new Error("File Upload failed")
    }

  const physician = new carePhysician({
    fileName: file.filename,
    filePath: filePath,
  });

  await physician.save()
  return physician
}
module.exports = {
    getPhysicians,
    createPhysician
}
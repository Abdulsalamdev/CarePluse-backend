const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { ACCESS_TOKEN } = process.env;

const Auth = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken)
    return res.status(401).send({ message: "Access Token not found" });
  try {
    const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN);
    req.user = {
      id: decodedAccessToken.userId,
    };
    next();
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { Auth };

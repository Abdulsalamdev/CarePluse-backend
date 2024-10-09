const express = require("express");
const router = express.Router();
const { userValidator, User } = require("../model/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bycrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { adminCheck } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
dotenv.config();

const {
  EMAIL,
  EMAIL_PASSWORD,
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

//generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

//generate ACCESS TOKEN
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, ACCESS_TOKEN, {
    subject: "ACCESS API",
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

//generate REFRESH TOKEN
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, REFRESH_TOKEN, {
    subject: "REFRESH API",
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

//creating sign-up
router.post("/sign-up", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = userValidator(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ message: "User already exists" });
    }

    //generate Random otp
    const otp = generateOtp();
    const otpExpiresIn = Date.now() + 15 * 60 * 1000;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      debug: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Password Reset Otp",
      text: `Your OTP is ${otp}. It is valid for 15 minutes`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
      color: #333;
    }

    .email-container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .email-header {
      background-color: #007bff;
      padding: 20px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      text-align: center;
      color: #ffffff;
    }

    .email-body {
      padding: 30px;
      text-align: center;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #007bff;
    }

    p {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .otp-code {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      background-color: #f4f4f7;
      padding: 10px;
      border-radius: 4px;
      display: inline-block;
      margin: 20px 0;
    }

    .email-footer {
      background-color: #f4f4f7;
      padding: 20px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    .btn {
      background-color: #007bff;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    }

    .btn:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Email Verification</h1>
    </div>
    <div class="email-body">
      <p>Hello,</p>
      <p>Thank you for registering with us. Please use the OTP code below to verify your email address:</p>
      <div class="otp-code">${otp}</div>
      <p>This OTP will expire in 15 minutes. If you did not request this, please ignore this email.</p>
     
    </div>
    <div class="email-footer">
      <p>If you have any questions, contact our support team.</p>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
    };

    const hashed = await bycrypt.hash(phone, 10);

    const newUser = new User({
      name,
      email,
      phone: hashed,
      otp,
      otpExpiresIn,
    });

    await newUser.save();
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(400).send({ message: error });
      return res.status(200).send({
        message: "User created successfully",
        success: "OTP Sent successfully",
      });
    });

    // return res.status(201).send();
  } catch (error) {
    return res.status(500).send({ message: error });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "Invalid User" });
    const verified = await bycrypt.compare(phone, user.phone);
    if (!verified) return res.status(401).send({ massage: "Invalid User" });

    const accessToken = generateAccessToken(user);

    if (user.isAdmin == true) {
      res.status(200).send({
        massage: "Admin successfully logged in",
        id: user._id,
        email,
        isAdmin: user.isAdmin,
        token: { accessToken },
      });
    } else {
      res.status(200).send({
        massage: "User successfully logged in",
        id: user._id,
        email,
        isAdmin: user.isAdmin,
        token: { accessToken },
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//verifing Email
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "email not found" });

    if (user.otp !== otp) {
      return res.status(400).send({ message: "invalid Otp" });
    }

    if (user.otpExpiresIn < Date.now())
      return res.status(400).send({ message: "OTP Expired" });

    user.otp = null;
    user.otpExpiresIn = null;
    user.save();

    res.status(200).send({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
});

module.exports = router;

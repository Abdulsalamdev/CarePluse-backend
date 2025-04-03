const express = require("express");
const { signUp, login, verifyEmail } = require("../controllers/users.controller");
const userRoute = express.Router();




//creating new user account
userRoute.post("/sign-up",signUp);

// Creating user Login
userRoute.post("/login", login);

// verifing User Emali
userRoute.post("/verify-email", verifyEmail);

module.exports = userRoute;

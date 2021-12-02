const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const userController = require("../controllers/user");

router.get("/register", userController.renderRegister);

router.post("/register", catchAsync(userController.register));


router.get("/login", userController.renderLogin);

//using passport.authenticate() which is added automatically 
//and specifying strategy as local for logging in
//also checking if the user already had a returnTo URL or not
//check middleware.js
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), userController.login);

router.get("/logout", userController.logout);




module.exports = router;


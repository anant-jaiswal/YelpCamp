const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundController = require("../controllers/campground");
const multer = require("multer");//multer is a middleware to parse multiparts form
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });//defining the destination for saving files

//Defining all the campground routes with the help pf campground controllers
router.get("/", catchAsync(campgroundController.index));

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

//upload.() is a multer helper function()
router.post("/", isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgroundController.createCampground));

router.get("/:id", catchAsync(campgroundController.showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));


router.put("/:id", isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgroundController.updateCampground));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

module.exports = router;
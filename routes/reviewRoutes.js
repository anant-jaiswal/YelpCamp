const express = require("express");
const router = express.Router({ mergeParams: true });
//merging params for review router is set to true to get campground ids
//check review router middleware
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const ExpressError = require("../utilities/ExpressError");
const { reviewSchema } = require('../schemas.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")
const reviewController = require("../controllers/review");


router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;
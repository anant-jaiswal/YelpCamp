const express = require("express");
const router = express.Router({ mergeParams: true });
//merging params for review router to get campground ids
//check review router middleware
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const ExpressError = require("../utilities/ExpressError");
const { reviewSchema } = require('../schemas.js');


//Server side validations for reviews using Joi
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
        //passing control to the next error handling middleware

    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created a new review.");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //The campground is getting updated by removing the particular review
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = router;
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


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;//this is possible because mergeParams is set to true above
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created a new review.");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //The campground is getting updated by removing the particular review
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = router;
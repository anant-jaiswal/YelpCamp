const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utilities/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/reviews");




//this middleware checks if the user has logged in or not in the current 
//browsing session
module.exports.isLoggedIn = (req, res, next) => {
    //req.isAuthenticated() is a passport helper function added to check whether 
    //a user is logged in or not
    //if the user is not logged in the user will be redirected to the login page
    if (!req.isAuthenticated()) {
        //storing which url the user was trying to surf to
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first.");
        return res.redirect("/login");
    }
    next();
}

//Server side validations for campgrounds using Joi
module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(msg, 400)
    }
    else {
        next();
        //passing control to the next error handling middleware
    }
}

//Server side middleware to ensure that the campground is manipulated by owner only
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permissions to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//Server side middleware to ensure that each review is manipulated by owner only
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permissions to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//Server side validations for reviews using Joi
module.exports.validateReview = (req, res, next) => {
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


const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");


router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });

}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //     throw new ExpressError("Invalid Campground Data", 400);
    // }
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Sucessfully created a new campground!")
    //Displaying flash success message after we have saved a campground
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",//this is populating the reviews associated with the campground
        populate: {
            path: "author"//populating authors of each review as well
        }
    }).populate("author");//this is populating one author of campground seperately;
    console.log(campground);
    //populate is used in order to display the reviews associated to each campground
    //in show.ejs
    // console.log(campground);

    //Displaying flash error if campground is not found
    if (!campground) {
        req.flash("error", "Cannot find the campground!");
        return res.redirect("/campgrounds");//route response ends here cus of return
    }
    res.render("campgrounds/show", { campground });
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //Displaying flash error if campground is not found
    if (!campground) {
        req.flash("error", "Cannot find the campground!");
        return res.redirect("/campgrounds");//route response ends here cus of return
    }
    res.render("campgrounds/edit", { campground });

}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfully updated the campground.");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a campground.");
    res.redirect("/campgrounds");
}));

module.exports = router;
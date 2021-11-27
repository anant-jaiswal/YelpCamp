const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        //first we will make a new User model instance with only email and username
        //then we will call User.register() which is a passport-local-mongoose static
        //password will be hashed with a salt and saved to the user model
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        //this is used for logging in the user after the user has newly registered
        //it uses a helper passport function called req.login() which takes
        //the newly registered user as first parameter and error callback as the 
        //second one
        req.login(registeredUser, err => {
            if (err) {
                return next(err); //this will hit the next error handling route
            }
            else {
                req.flash("success", "Welcome to YelpCamp!");
                res.redirect("/campgrounds");
            }
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}))


router.get("/login", (req, res) => {
    res.render("users/login");
})

//using passport.authenticate() which is added automatically 
//and specifying strategy as local for logging in
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome back to YelpCamp!");
    const redirectURL = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectURL);

})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");

})




module.exports = router;


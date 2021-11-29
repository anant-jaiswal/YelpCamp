const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const Joi = require("joi");
const flash = require("connect-flash");
// const campgroundSchema = require("./schemas.js");
// const reviewSchema = require("./schemas.js");
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const campgroundRoutes = require("./routes/campgroundRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");



const Review = require("./models/reviews");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database is connected successfully!");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//used for parsing req.body
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))
//this is for serving static js assets from public directory
//also check boilerplate.ejs
app.use(flash());


sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        //setting up the cookie expiration date as a week from the session start
        maxAge: (1000 * 60 * 60 * 24 * 7) //setting the maxAge of session as a week
    }
}//Right now the session store is memory store which is strictly 
//advised to use only for development
app.use(session(sessionConfig));//setting up sessions for YelpCamp

app.use(passport.initialize());
app.use(passport.session());//this is for persistent login sessions
//this will enable us to skip adding the user._id to user sessions for
//checking if the user has logged in or not
//This must be placed after app.use(session)

passport.use(new localStrategy(User.authenticate()));
//this is telling passport to use passport-local that is required in localStrategy
//which is further using the User model's authenticate() function which is
//added automatically in the user model

passport.serializeUser(User.serializeUser());
//this is telling passport how to serialize user in the session
//serializeUser() is added automatically to the user model

passport.deserializeUser(User.deserializeUser());
//this is telling passport how to deserialize user in a session
//deserializeUser() is added automatically to the user model


//Server side validations for campgrounds using Joi
const validateCampground = (req, res, next) => {

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

//Defining the flash middleware and it should be placed before route handlers
app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;//used to store the current user who is using YelpCamp
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    next();//passing control to next middleware
})//whatever res.locals will contain, it will be automatically passed in our templates
//this ensures that we dont have to pass flash messages as parameters in different routes

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes);
//mergeParams is set to true to get ":id"

app.get("/", (req, res) => {
    res.render("home");
});

// app.get("/register", async (req, res) => {
//     const user = new User({ email: "anant.jaiswal@rocketmail.com", username: "anantJ" });
//     const newUser = await User.register(user, "dcshoecousa");
//     //register() is a static method added to the user model with passport-local-mongoose
//     res.send(newUser);
// })


app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
    //Passing the error to next error handling middleware
})
//If no above route is matched in the request, this
//will be executed

// app.get("/makecampground", async (req, res) => {
//     const camp = new Campground({ title: "My Backyard", description: "cheap camping!" });
//     await camp.save();
//     res.send(camp);
// })

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Oh no, something went wrong!";
    }
    res.status(statusCode).render("error", { err });
})//This is the main error handling middleware

app.listen(3000, () => {
    console.log("Listening to port 3000!");
})
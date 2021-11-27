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


const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) {
    //     throw new ExpressError("Invalid Campground Data", 400);
    // }
    const campground = new Campground(req.body.campground);
    //mapping over the array that has been added to req.files
    //adding the path and filename from req.files and adding them to campground images 
    //as arrays
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Sucessfully created a new campground!")
    //Displaying flash success message after we have saved a campground
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",//this is populating the reviews associated with the campground
        populate: {
            path: "author"//populating authors of each review as well
        }
    }).populate("author");//this is populating one author of campground seperately;
    //populate is used in order to display the reviews associated to each campground
    //in show.ejs
    // console.log(campground);

    //Displaying flash error if campground is not found
    if (!campground) {
        req.flash("error", "Cannot find the campground!");
        return res.redirect("/campgrounds");//route response ends here cus of return
    }
    res.render("campgrounds/show", { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //Displaying flash error if campground is not found
    if (!campground) {
        req.flash("error", "Cannot find the campground!");
        return res.redirect("/campgrounds");//route response ends here cus of return
    }
    res.render("campgrounds/edit", { campground });

}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
            //this will delete the images to be deleted from our cloudinary storage
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        //this deletes the images to be deleted from mongodb
    }
    req.flash("success", "Successfully updated the campground.");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a campground.");
    res.redirect("/campgrounds");
}
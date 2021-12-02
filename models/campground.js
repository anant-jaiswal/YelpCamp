const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews")

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//adding a virtual called "thumbnail" to the image schema which will return the images
//of width 200px
//Note that "w_200" is a cloudinary api for image manipulation 
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [//array of reviews
        {
            type: Schema.Types.ObjectId, //reviews will be an attribute of the
            //campground schema
            ref: "Review"
            //The type of the reviews attribute will be of the Object ID of 
            //reviews schema
        }
    ]
});

//This is a mongoose post delete middleware for deletion of a campground
//The deletion route of a campground uses "findByIdAndDelete" which itself triggers
//"findOneAndDelete" middleware. Therefore we are making a post deletion middleware 
//for findOneAndDelete trigger directly
campgroundSchema.post("findOneAndDelete", async function (doc) {
    //Here "doc" is the campground object that has been just deleted
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews //deleting the reviews from the review collections
                //in the database whose reviewIds matches to the reviews of the 
                //campground that was just deleted
            }
        })
    }

})

module.exports = mongoose.model("Campground", campgroundSchema);
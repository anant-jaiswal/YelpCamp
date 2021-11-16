const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const review = new Schema({
    body: String,
    rating: Number

});

module.exports = mongoose.model("Review", review);
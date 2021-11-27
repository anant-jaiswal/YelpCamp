const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});//making the user schema without the username and password attributes

//adding passport-local-mongoose package as a plugin to the userSchema
//this will automatically create unique username and password attributes for each user model
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);


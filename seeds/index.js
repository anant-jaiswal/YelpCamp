//This js file is used for adding seed campgrounds in db
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database is connected successfully!");
});

const titleGenerator = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "61a12f0e43f0a0df51f35634",
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${titleGenerator(descriptors)} ${titleGenerator(places)}`,
            image: "https://source.unsplash.com/collection/429524/1600x900",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium sit ratione mollitia consequatur sint aliquid, nesciunt placeat at velit labore enim, odio facere atque qui quae, quas quam ex molestias.",
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
const cloudinary = require('cloudinary').v2;
//multer-storage-cloudinary helps to parse the multipart form image data
//and then store it in our cloudinary account
//cloudinary then gives image urls which is then stored in our mongodb
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//associating my cloudinary account with the cloudinary instance used in Yelpcamp
//here the cloudinary instance is configured
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

//this is setting up our storage instance in cloudinary environment
//this will be required as storage/upload path for using upload feature of multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "YelpCamp",
        allowedFormats: ["jpeg", "png", "jpg"]
    }
});

module.exports = {
    cloudinary,
    storage
}
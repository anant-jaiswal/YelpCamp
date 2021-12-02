const Joi = require("joi");

//This is not a mongoose schema. This is a schema for validations.
//These are for validations on the server side - using Postman, AJAX etc.
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required(),//setting req.body.campground as a required object
    deleteImages: Joi.array()
});

// module.exports = campgroundSchema;

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()//setting req.body.review as a required object
});

// module.exports = reviewSchema;
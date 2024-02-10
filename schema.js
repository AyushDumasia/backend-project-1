const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().max(30).required(),
        description : Joi.string().required(),
        image : Joi.string(),
        price : Joi.number().min(1000).max(8000).required(),
        location : Joi.string().required(),
        country : Joi.string().required()
    }).required(),
});


module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required(),
        comment : Joi.string().required()
    }).required(),
})

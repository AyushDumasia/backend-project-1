const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Chance  = require('chance');
const chance = new Chance();

const reviewSchema = new Schema({
    username : String,
    comment : String,
    review : {
        type :  Number,
        min : 1, 
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})


const Review = mongoose.model("Review" , reviewSchema);

module.exports = Review;
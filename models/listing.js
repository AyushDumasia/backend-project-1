const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./reviews.js');
const Review = require('./reviews.js');

const listingSchema = new Schema({
    username : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    description: String,
    image : {
        filename: "listingimage",
        type : Object, 
        default : "https://unsplash.com/photos/brown-wooden-lounge-chairs-on-brown-wooden-dock-during-daytime-xEaAoizNFV8",
        set : (v)=> v === "" ? "https://unsplash.com/photos/brown-wooden-lounge-chairs-on-brown-wooden-dock-during-daytime-xEaAoizNFV8" : v
    },   
    price : Number,
    location : String,
    country : String,
    saved : {
        type : Boolean,
        default  : false,
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ]
});


listingSchema.post("findOneAndDelete" , async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})





const Listing  = mongoose.model("Listing",listingSchema);

module.exports  = Listing;
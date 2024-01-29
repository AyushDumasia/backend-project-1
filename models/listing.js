const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const listingSchema = new Schema({
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
    }
});

const Listing  = mongoose.model("Listing",listingSchema);

module.exports  = Listing;
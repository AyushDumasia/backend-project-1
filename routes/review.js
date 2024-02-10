const express = require('express');
const router = express.Router({mergeParams : true});
const Listing = require('../models/listing.js');
// const {listingSchema , reviewSchema} = require('../schema.js');
const Chance  = require('chance');
const chance = new Chance();
const  Review = require('../models/reviews.js')
// const listings = require("../routes/listing.js")


router.post("/" , async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let {review , comment} = req.body;
    let newUsername = chance.name();
    let newReview = new Review({
        username : newUsername,
        review : review,
        comment : comment,
        createdAt : Date()
    });
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Comment Saved : " + newReview);
    res.redirect(`/listing/${listing._id}`);
});

router.delete("/:reviewId" , async(req,res)=>{
    let { id , reviewId } = req.params;

    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findById(reviewId);
    res.redirect(`/listing/${id}`);
})


module.exports = router;
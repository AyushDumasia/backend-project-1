const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const {listingSchema , reviewSchema} = require('../schema.js');

//New post Route
router.get("/new", (req, res) => {
    // let {allData} = res.body;
    res.render("new.ejs");
})


//For Cart Route
router.get("/cart", async (req, res) => {
    const allListings = await Listing.find({ saved: true });
    res.render("listing/cart.ejs", { allListings });
})

//Main Route
router.get("/", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings: allListings });
})


//For Ascending Route
router.get("/asc", async (req, res) => {
    const allListings = await Listing.find().sort({ price: 1 });
    res.render("listing/index.ejs", { allListings });
});

//For descending Route
router.get("/desc", async (req, res) => {
    const allListings = await Listing.find().sort({ price: -1 });
    res.render("listing/index.ejs", { allListings });
});


router.patch("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate({ _id: id }, { $set: { saved: true } });
    // alert("saver");
    res.redirect("/listing");
})

//Remove From Cart
router.patch("/cart/:id", async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findByIdAndUpdate({ _id: id }, { $set: { saved: false } });
    res.redirect("/listing/cart");
    // console.log(result);
})


//Search Route
router.get("/search", async (req, res) => {
    let match = {};
    if (req.query.keyword) {
        match.title = new RegExp(req.query.keyword, "i");
    }
    if (req.query.location || req.query.country) {
        match.$and = [];

        if (req.query.location) {
            match.$and.push({ location: new RegExp(req.query.location, "i") });
        }

        if (req.query.country) {
            match.$and.push({ country: new RegExp(req.query.country, "i") });
        }
    }
    if (req.query.country) {
        match.country = new RegExp(req.query.country, "i");
    }
    const allListings = await Listing.aggregate([
        { $match: match }
    ]).exec();
    res.render("listing/index.ejs", { allListings: allListings });
})


router.post("/", async (req ,res , next) =>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    let {username, title, price, image, description, location , country } = req.body;
        let newPost = new Listing({
            username : username,
            title: title,
            price: price,
            image: {
                filename : 'listingimage',
                url : image,
            },
            description: description,
            location: location,
            country : country
        })
        console.log(newPost);
        await newPost.save();
        res.redirect("/listing");
});


//Show Post Route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id).populate("reviews");
    // res.send("working");
    res.render("listing/show.ejs", { listingData });
})


5
//Edit Route
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const UpdateData = await Listing.findById(id);
    res.render("edit.ejs", { UpdateData });
})

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let { title: title, price: price,image : image, description: description, location: location , country : country} = req.body;
    let updateCard = await Listing.findByIdAndUpdate(
        id,
        {
            title: title,
            price: price,
            image: {
                filename : 'listingimage',
                url : image,
            },
            description: description,
            location: location,
            country : country
        },
        {
            runValidators: true,
            new: true,
        }
    )
    // console.log(updateCard);
    res.redirect("/listing");
})


//Delete Route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})

module.exports = router;
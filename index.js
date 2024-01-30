const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Listing = require('./models/listing.js');
const router = express.Router();

app.use(methodOverride("_method"));
app.use(express.urlencoded({ urlencoded: true }));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => {
    console.log("server is listening");
})


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => {
        console.log("success");
    })
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.redirect("/listing");
})

// app.get("/testing", async (req,res)=>{
//     let sample = new Listing({
//         title : "My Life",
//         des : "I am .....",
//         price : "120000000",
//         loc : "India",
//         country : "surat"
//     });
//     await sample.save();
//     console.log(sample);
//     res.render("index.ejs",{sample : sample});
// })


app.get("/listing", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings: allListings });
})

app.get("/listing/search", async (req, res) => {
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


app.get("/listing/new", (req, res) => {
    // let {allData} = res.body;
    res.render("new.ejs");
})
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id);
    // res.send("working");
    res.render("listing/show.ejs", { listingData });
})



app.post("/listing", async (req, res) => {
    let { title, price, description, location } = req.body;
    let newPost = new Listing({
        title: title,
        price: price,
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        description: description,
        location: location
    })
    console.log(newPost);
    await newPost.save();
    res.redirect("/listing");
})

app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    const UpdateData = await Listing.findById(id);
    res.render("edit.ejs", { UpdateData });
})

app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let { title: title, price: price, description: description, location: location } = req.body;
    let updateCard = await Listing.findByIdAndUpdate(
        id,
        {
            title: title,
            price: price,
            description: description,
            location: location,
        },
        {
            runValidators: true,
            new: true,
        }
    )
    console.log(updateCard);
    res.redirect("/listing");
})



app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})


app.get("/listings/asc", async (req, res) => {
    const allListings = await Listing.find().sort({ price: 1 });
    res.render("listing/index.ejs", { allListings });
});

app.get("/listings/desc", async (req, res) => {
    const allListings = await Listing.find().sort({ price: -1 });
    res.render("listing/index.ejs", { allListings });
});

app.get("/listings/cart", async (req, res) => {
    const allListings = await Listing.find({ saved: true });
    res.render("listing/cart.ejs", { allListings });
})

app.patch("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate({ _id: id }, { $set: { saved: true } });
    res.redirect("/listing");
})



app.patch("/listings/cart/:id", async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findByIdAndUpdate({ _id: id }, { $set: { saved: false } });
    res.redirect("/listings/cart");
    console.log(result);
})

// const ITEMS_PER_PAGE = 10;

// router.get('/listing', async (req, res) => {
//     const page = +req.query.page || 1;

//     try {
//         const totalListings = await Listing.countDocuments();
//         const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);

//         const listings = await Listing.find()
//             .skip((page - 1) * ITEMS_PER_PAGE)
//             .limit(ITEMS_PER_PAGE);

//         res.render('listings', {
//             listings,
//             currentPage: page,
//             totalPages,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const Listing = require('./models/listing.js');

app.use(methodOverride("_method"));
app.use(express.urlencoded({urlencoded : true}));
app.set("view engine" , "ejs");
app.set("views",path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname,"public")));

app.listen(8080 , ()=>{
    console.log("server is listening");
})


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(()=>{
        console.log("success");
    })
    .catch(err => console.log(err));

app.get("/",(req,res)=>{
    res.send("Home Page");
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


app.get("/listing", async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listing/index.ejs", {allListings : allListings});
})

app.get("/listing/new" ,(req,res)=>{
    // let {allData} = res.body;
    res.render("new.ejs");
})
app.get("/listing/:id", async (req,res)=>{
    let {id} = req.params; 
    const listingData = await Listing.findById(id);
    // res.send("working");
    res.render("listing/show.ejs" , {listingData});
})



app.post("/listing" ,async (req,res) => { 
    let {title , price , description , location } = req.body;
    let newPost = new Listing({
        title : title,
        price : price,
        image : {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1682685797365-41f45b562c0a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        description : description,
        location : location
    })
    console.log(newPost);
    await newPost.save();
    res.redirect("/listing");
})

app.get("/listing/:id/edit",async (req,res)=>{
    let {id} = req.params; 
    const UpdateData = await Listing.findById(id);
    res.render("edit.ejs", {UpdateData});
})

app.put("/listing/:id" , async (req,res)=>{
    let {id} = req.params;
    let {title : title, price : price , description : description, location : location} = req.body;
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

app.delete("/listing/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})
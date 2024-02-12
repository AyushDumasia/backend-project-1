const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

app.use(methodOverride("_method"));
app.use(express.urlencoded({ urlencoded: true }));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => {
    console.log("server is listening");
})


//Logger
app.use((req,res,next) =>{
    if (req.path !== "/favicon.ico") {
    // req.time = new Date( Date.now() ).toString();
    console.log(req.method, req.hostname, req.path);
    }
    next();
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

app.use("/listing" , listings);
app.use("/listing/:id/reviews" , reviews);


app.get("*" , (req,res) =>{
    res.render("listing/error.ejs");
})




// app.use((err,req,res, next) =>{
//     let {statusCode , message} = err;
//     res.status(statusCode).res.send(message);
// })

// app.all("*" , (req , res , next) =>{
//     next(new ExpressError(404 , "Page Not Found"));
// })
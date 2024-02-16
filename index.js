const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/users.js')
const Listing = require('./models/listing.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')

app.use(methodOverride("_method"));
app.use(express.urlencoded({ urlencoded: true }));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => {
    console.log("server is listening");
})

const sessionOptions = {
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized : true,
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Logger
app.use((req,res,next) =>{
    if (req.path !== "/favicon.ico") {
    // req.time = new Date( Date.now() ).toString();
    console.log(req.method,req.path);
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
    res.redirect("/log-in");
})

app.use("/listing" , listingRouter);
app.use("/listing/:id/reviews" , reviewRouter);
app.use("/" , userRouter);






// app.get("/demoUser" , async (req,res) =>{

//     let fakeUser = new User({
//         email : "ayush182@gmail.com",
//         username : "ayushDumasia_2"
//     });

//     let newUser = await User.register(fakeUser , "Ayush@18");
//     res.send(newUser);
// })

app.get("*" , async (req,res) =>{
    let counts = await Listing.countDocuments({saved : true});
    res.render("listing/error.ejs" , {counts});
})




// app.use((err,req,res, next) =>{
//     let {statusCode , message} = err;
//     res.status(statusCode).res.send(message);
// })

// app.all("*" , (req , res , next) =>{
//     next(new ExpressError(404 , "Page Not Found"));
// })
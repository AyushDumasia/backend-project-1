const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const session = require('express-session');
const passport = require('passport');

router.get("/sign-up" , async(req,res) =>{
    res.render("users/signUp.ejs")
})

router.post("/sign-up" , async(req,res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email,username});
        let result = await User.register(newUser , password);
        console.log(result);
        req.flash("success" , "Login Successful");
        res.redirect("/listing");
    }
    catch(err){
        res.send(err.message);
    }
})


router.get("/log-in" , (req,res)=>{
    res.render("users/logIn.ejs");
})

router.post("/log-in" ,passport.authenticate("local" , {failureRedirect : '/log-in'}) ,  async (req,res)=>{
    try{
        req.flash("success" , "Log In Successfully");
        res.redirect("/listing");
    }
    catch{
        res.send(err.message);  
    }
    
})

module.exports = router;

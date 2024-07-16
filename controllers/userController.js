const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const { homedir } = require('os');


const securePassword = async(password) => {
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error){
        console.log(error.messgae);
    }
}


const loadLogin = async (req,res) =>{
    try {
        res.render('user/login')
    } catch (error) {
        console.log(error);
    }
}

const loadRegister = async (req,res) =>{
    try {
        res.render('user/register')
    } catch (error) {
        console.log(error);
    }
}

const insertUser = async (req, res) => {
    try {
        const exist = await User.findOne({ email: req.body.email });
        if (exist) {
            console.log('Email Already Exists!');
            req.flash('error', 'Email Already Exists!');
            res.redirect('/signup');
        } else {
            const spassword = await securePassword(req.body.password);
            const user = new User({
                email: req.body.email,
                name: req.body.name,
                mobile: req.body.mobile,
                password: spassword,
                is_admin: 0,
            });

            await user.save();
            req.flash('success', 'Registration Completed');
            res.redirect('/signup');
           
        }
    } catch (error) {
        console.log(error);
        // Send an error response
        res.status(500).json({ message: 'An error occurred while registering the user.' });
    }
};


const verifyLogin = async(req,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password
        console.log('email:',email);
        console.log('password:',password);
        const userData = await User.findOne({email:email});
        console.log('userData:',userData);


        if(userData){
            const isPasswordMatch = await bcrypt.compare(password, userData.password);
            if (isPasswordMatch) {

                req.session.userid = userData._id;
                req.session.email = email; // Store user email in the session
                req.session.name = userData.name; // Store username in the session
                req.session.mobile = userData.mobile;
                res.redirect('/home');
            } else {
                // Passwords do not match
                req.flash('error', 'Incorrect password');
                res.redirect('/login');
            }  
        }else{
            req.flash('error', 'User is not Exist!.Try to Signup');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
}



const loadHome = async (req,res)=>{
    try {
        const userId = req.session.userid
        const user = await User.findById(userId);
        const username = user.name
        const email = user.email
        const mobile =  user.mobile
        res.render('user/home',{email,username,mobile})
    } catch (error) {
        console.log(error);
    }
}


const userLogout = async (req,res)=>{
    try {
        req.session.userid = null
        res.redirect('/login')
    } catch (error) {
        console.log(error.message)
    }
 }


 const loadEditProfile = async (req,res)=>{
    try {
        const userId = req.session.userid
        const user = await User.findById(userId);
        const username = user.name
        const email = user.email
        const mobile =  user.mobile
        res.render('user/editProfile',{username,email,mobile})
    } catch (error) {
        console.log(error);
    }

 }


 const updateUser = async (req,res) =>{
    try {
        const userId = req.session.userid
        const user = await User.findById(userId);
        if (user) {
            user.name = req.body.name;
            user.email = req.body.email;
            user.mobile = req.body.mobile;

            await user.save();
            req.flash('success', 'Profile updated!');
            res.redirect('/home');
        } 
    } catch (error) {
        console.log(error);
    }

}




module.exports = {
    loadLogin,
    loadRegister,
    insertUser,
    loadHome,
    verifyLogin,
    userLogout,
    loadEditProfile,
    updateUser

}
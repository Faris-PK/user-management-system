const e = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
 
    }
}


const loadLogin = async (req,res) =>{
    try {

        //console.log('inside of loadLogin');
        res.render('adminLogin')
    } catch (error) {
        console.log(error);
    }
}

const adminVerifyLogin = async (req,res) =>{
    try {
      //  console.log('Inside of login submit');
        const adminEmail = req.body.adminEmail;
        const adminPassword = req.body.adminPassword;


        if(adminEmail  == process.env.ADMIN_EMAIL && adminPassword  == process.env.ADMIN_PASSWORD){
            // Session variable for the authenticated admin
            req.session.admin = adminEmail;
            res.redirect('/admin/adminHome');
    
        }
        else{
            req.flash('error', 'Email and Password not found');
            res.redirect('/admin/login');
        }


    } catch (error) {
        console.log(error);
    }
}


const loadHome = async (req,res) =>{

   // console.log('inside of Admin Home');
    try {
        const usersData = await User.find({is_admin: 0})
        //console.log('usersData: ',usersData);
        res.render('adminHome',{users:usersData})
    } catch (error) {
        console.log(error);
    }

}

const searchUsers = async (req, res) => {
    try {
        const searchQuery = req.query.search;
       
        const usersData = await User.find({
            is_admin: 0,
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { mobile: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        res.render('adminHome', { users: usersData });
    } catch (error) {
        console.log(error);
        
    }
};


const loadEditUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.render('editUser', { user });
    } catch (error) {
        console.log(error);
        
    }
};

const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('userId:', userId);
        const updatedUser = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            
        };
        await User.findByIdAndUpdate(userId, updatedUser);
        
        res.redirect('/admin/adminHome');
    } catch (error) {
        console.log(error);
    }
};


const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.redirect('/admin/adminHome');
    } catch (error) {
        console.log(error);
        
    }
};

const adminLogout = async (req,res)=>{
    try {
        req.session.admin = null
        res.redirect('/admin/login')
    } catch (error) {
        console.log(error.message)
    }
 }
 
 
 const loadAddUser = async (req,res) =>{
    try {
        res.render('addUser')
    } catch (error) {
        console.log(error);
    }
 }

 const addUser = async (req,res) =>{
    try {
       
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password
           
        });

        await newUser.save();
        res.redirect('/admin/adminHome');
    } catch (error) {
        console.log(error);
    }
 }

module.exports = {
    loadLogin,
    adminVerifyLogin,
    loadHome,
    searchUsers,
    loadEditUser,
    deleteUser,
    adminLogout,
    editUser,
    loadAddUser,
    addUser
    
}
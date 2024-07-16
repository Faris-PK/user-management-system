const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/UMS')
const express = require('express');
const app = express();
const path = require('path');
const flash = require('express-flash');
const nocache = require('nocache');
const session  = require('express-session');
const dotenv = require('dotenv').config();


app.use(nocache());

app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'public/uploads')))

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));
app.use(express.json());


//For user Routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//For admin Route
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);





app.listen(3001, ()=> {
    console.log("http://localhost:3001");
});
  
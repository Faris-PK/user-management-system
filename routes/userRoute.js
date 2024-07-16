const express = require('express');
const user_route = express();


user_route.set('views', './views');
user_route.set('view engine','ejs');

user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));


const userController = require('../controllers/userController');
const userAuth = require('../middlewares/useAuth')

user_route.get('/login',userAuth.isLogout,userController.loadLogin);
user_route.post('/loginsubmit',userController.verifyLogin);

user_route.get('/signup',userAuth.isLogout,userController.loadRegister);
user_route.post('/register',userController.insertUser);

user_route.get('/home',userAuth.isLogin,userController.loadHome);
user_route.get('/',userAuth.isLogin,userController.loadHome);
user_route.get('/logout',userController.userLogout);

user_route.get('/editProfile',userAuth.isLogin,userController.loadEditProfile)
user_route.post('/updateUser',userController.updateUser);




module.exports = user_route
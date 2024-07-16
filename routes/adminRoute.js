
const express = require('express');
const admin_route = express();

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));


const adminController = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminAuth')

admin_route.get('/login',adminAuth.isLogout,adminController.loadLogin);
admin_route.post('/adminSubmit',adminController.adminVerifyLogin);
admin_route.get('/logout',adminAuth.isLogin,adminController.adminLogout)

admin_route.get('/adminHome',adminAuth.isLogin,adminController.loadHome);
admin_route.get('/searchUsers',adminAuth.isLogin, adminController.searchUsers);

admin_route.get('/addUser', adminAuth.isLogin, adminController.loadAddUser);
admin_route.post('/addUser', adminAuth.isLogin, adminController.addUser);

admin_route.get('/edit/:id', adminAuth.isLogin, adminController.loadEditUser);
admin_route.post('/editUser/:id', adminController.editUser);

admin_route.get('/delete/:id', adminController.deleteUser);

module.exports = admin_route
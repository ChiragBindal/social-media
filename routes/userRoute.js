const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const Router  = express.Router();

Router.route('/signUp').post(authController.signUp);
Router.route('/login').post(authController.login);

Router.route('/updateMe').post(authController.protect , userController.updateMe);
Router.route('/deleteMe').delete(authController.protect , userController.deleteMe);

Router.route('/allUser').get( userController.getAllUser);

Router
    .route('/:id')
    .get( userController.getUser)
    .delete( userController.deleteUser)
module.exports  = Router;
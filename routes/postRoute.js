const express = require('express');
const postController = require('../controller/postController');
const authController = require('../controller/authController');
const Router = express.Router();

Router.route('/').post(authController.protect , postController.createPost);
Router.route('/updatePost/:id').patch(authController.protect , postController.updatePost);
Router.route('/deletePost/:id').delete(authController.protect , postController.deletePost);
Router.route('/likePost/:id').patch(authController.protect , postController.likePost);
Router.route('/timeline').get(authController.protect , postController.timeline);
Router.route('/').get(postController.getPost)


module.exports = Router;
'use strict';

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UsersController');

router.get('/users', usersController.getUsers);
router.get('/search_system_users', usersController.searchSystemUsers);
router.get('/profile', usersController.getProfile);
router.post('/register', usersController.registerUser);
router.post('/sign_in', usersController.signIn);
router.post('/update_profile', usersController.editProfile);

module.exports = {
  routes: router
}
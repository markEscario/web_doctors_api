'use strict';
const userService = require('../data/UsersService');
const config = require("../Token/auth.config");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const searchSystemUsers = async (req, res) => {
  try {
    let searchData = req.query.filter_params
    const users = await userService.searchSystemUsers(searchData);
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const registerUser = async (req, res) => {
  try {
    const userRequest = req.body;

    const users = await userService.createUser(userRequest);
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const signIn = async (req, res) => {
  try {
    const reqBody = req.body;

    const logIn = await userService.logIn(reqBody);
    if (logIn.USERNAME && logIn.USER_PASSWORD) {
      var token = jwt.sign({ user_code: logIn.USER_CODE }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        id: logIn.ID,
        user_code: logIn.USER_CODE,
        firstname: logIn.FIRSTNAME,
        lastname: logIn.LASTNAME,
        position: logIn.POSITION,
        email: logIn.EMAIL,
        profileImage: logIn.IMAGEPROFILE,
        username: logIn.USERNAME,
        accessToken: token
      });
    } else {
      res.status(200).send({ message: logIn })
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const getProfile = async (req, res) => {
  try {
    const reqQuery = req.query
    const profile = await userService.getProfile(reqQuery);
    res.status(200).send(profile)
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const editProfile = async (req, res) => {
  try {
    const userRequest = req.body;

    const users = await userService.editProfile(userRequest);
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  getUsers,
  searchSystemUsers,
  registerUser,
  signIn,
  editProfile,
  getProfile,
}
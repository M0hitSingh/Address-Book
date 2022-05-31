const express = require('express');
const jwt = require('jsonwebtoken');
const {body} = require('express-validator');
const router = express.Router();

const otp = require('../models/otp');
const user = require('../models/user');
const contacts = require('../models/contacts');

const loginController = require('../controllers/login');
const signupController = require("../controllers/signup");

router.get('/login',loginController.login);
router.post('/signup',body('email').isEmail().toLowerCase(),signupController.signup);
router.post("/otp",signupController.otp_request);
router.post("/setpass",body('password').isLength({min:6,max:10}).matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\$#%@&*/+_=?^!]).{6,}$"),signupController.password_req);
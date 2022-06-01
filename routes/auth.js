const express = require('express');
const {body} = require('express-validator');
const router = express.Router();

const loginController = require('../controllers/login');
const signupController = require("../controllers/signup");

router.get('/login',loginController.login);
router.post('/signup',body('email').isEmail().toLowerCase(),signupController.signup);
router.post("/otp",signupController.otp_request);
router.post("/setpass",body('password').isLength({min:6,max:10}).matches("^(?=.*?[A-Z])(?=.*?[a-z]).{6,10}$"),signupController.password_req);
router.get('/renewtoken',loginController.renewToken);
module.exports = router;
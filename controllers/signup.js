const otpGenrator = require('otp-generator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validationResult = require('express-validator');
const sendgrid = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');

const user = require('../models/user');
const otp = require('../models/otp');
const contacts = require('../models/contacts');
const { async } = require('regenerator-runtime');

const transport = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: process.env.API
    }
}))

exports.signup = async (req ,res ,next)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation failed');
            error.status = 422;
            throw error;
        }
        userdata = await user.findOne({email:email , verified:true});
        if(userdata){
            const error = new Error('Already Exist');
            error.status = 409;
            throw error;
        }
        const userdetails = new user({
            email:email
        })
        userdetails.save();
        const OTPgen = otpGenrator.generate(6 ,{
            digits:true , alphabets : false , uppercase:false,
            specialChars:false
        });
        otp_result = await otp.findOne({email:email});
        if(otp_result == null){
            const Otp = new otp({
                email:email,
                otp:OTPgen
            });
            Otp.save();
        }
        else otp_result.findOneAndUpdate({email:email},{otp:OTPgen});
        transport.sendMail({
            to:email,
            from:'Vouch_Digital@gmail.com',  
            subject:'your OTP for Address Book',
            html:`<h3> your otp is :  ${OTPgen} </h3>`
        })
        res.status(201).json("otp send");
    }
    catch(err){
        next(err);
    }
}

exports.otp_request= async (req, res, next )=>{
    try{
        const email = req.body.email;
        const enteredOtp = req.body.otp;
        const userOtp = await otp.findOne({email:email});
        userdata = await user.findOne({email:email , verified:false});
        if(enteredOtp == userOtp.otp){
            userdata.verified = true;
            userdata.save();
            return res.status(202).json('otp verified');
        } 
        else{
            const error = new Error('verification failed');
            error.status = 401;
            throw error;
        }
    }
    catch(err){
        next(err);
    }
}
exports.password_req = async (req,res,next)=>{
    const name = req.body.name;
    const pass = req.body.password;
    const confirmpass = req.body.confirmpass;
    const Phno = req.body.PhoneNumber;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.status = 401;
        throw errors;
    }
    if(pass !== confirmpass){
        const error = new Error('password must be same!');
        error.status = 422;
        throw error;
    }
    const hpass = await bcrypt.hash(pass ,10);
    const accessToken = jwt.sign({email:email},process.env.AC,{expiresIn:"5m"});
    const refreshToken = jwt.sign({email:email},process.env.RE, {expiresIn:"15m"});
    const userdetails = {
        fullname : name,
        password : pass,
        Phno : Phno
    }
    const userdata = user.findOneAndUpdate({email:email ,verified:true} , {userdetails});
    if(!userdata){
        const error = new Error('No Data Found');
        error.status = 404;
        throw error;
    }
}
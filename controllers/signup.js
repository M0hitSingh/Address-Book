const otpGenrator = require('otp-generator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validationResult = require('express-validator');
const sendgrid = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');

const user = require('../models/user');
const otp = require('../models/otp');
const contacts = require('../models/contacts');

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
        userdata = await user.findOne({email:email});
        if(userdata){
            const error = new Error('Already Exist');
            error.status = 409;
            throw error;
        }
        const OTPgen = otpGenrator.generate(6 ,{
            digits:true , alphabets : false , uppercase:false,
            specialChars:false
        });
        otp_result = await otp.findOne({email:email});
        if(otp_result == null){
            const otp = new otpmodel({
                email:email,
                otp:OTPgen
            });
            otp.save();
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
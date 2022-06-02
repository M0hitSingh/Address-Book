const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const user = require('../models/user');


exports.login = async (req ,res ,next) =>{              // For Login To Address Book
    try{
        const email = req.body.email;
        const pass = req.body.password;
        // validation for email
        const emailregex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        var validemail = emailregex.test(email);
        if (!validemail) {
          const error = new Error('Please enter a valid email');
          error.statusCode = 422;
          throw error;
        }
        const result = await user.findOne({email:email , verified:true});
        if(!result) return res.status(404).json('Not found');        // if user not found in DB

        bcrypt.compare ( pass, result.password).then(item=>{
            if(item){
                const accessToken = jwt.sign({email:email},process.env.AC,{expiresIn:"5m"});
                const refreshToken = jwt.sign({email:email},process.env.RE , {expiresIn:"15m"});
                return res.status(202).json({
                    email,
                    accessToken,
                    refreshToken
                });
            }
            res.status(401).json('incorrect pass');
        })
    }
    catch(err){
        next(err);
    }
}

exports.renewToken = (req,res,next)=>{          //genrating Acces token form refresh token
    try{
        const refreshToken = req.body.token;
        if(!refreshToken){
            return res.status(403).json({message:"User not authenticated"})
        }
        jwt.verify(refreshToken,process.env.RE,(err,user)=>{
            if(!err){
                //console.log(user);
                const accessToken = jwt.sign({email:user.email,userId:user.userId},process.env.AC,{expiresIn:"5m"});
                return res.status(201).json({accessToken:accessToken});
            }
            else{
                err.status = 403;
                throw err;
            }
        });
    }
    catch(err){
        next(err);
    }
}
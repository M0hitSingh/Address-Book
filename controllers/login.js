const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const user = require('../models/user');

exports.login = async (req ,res ,next) =>{
    try{
        const email = req.body.email;
        const pass = req.body.password;
        const emailregex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        var validemail = emailregex.test(email);
        if (!validemail) {
          const error = new Error('Please enter a valid email');
          error.statusCode = 422;
          throw error;
        }
        const result = await user.findOne({email:email});
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
const jwt = require('jsonwebtoken');
const user = require('../models/user');

module.exports = (req, res, next) => {
  try{
      const authHeader = req.get('Authorization');
      if (!authHeader) {
          return res.status(420).json('token required')
      }
      else{
          const token = authHeader.split(' ')[1];
          jwt.verify(token,process.env.AC,async(err,decode)=>{
            try{
                if(decode)
                { 
                 const email=decode.email;
                 const userData = await user.findOne({email:email});
                 if(userData)
                 {
                   req.user = userData;
                 }
                 else
                 {
                      const err= new Error('User not exist');
                      err.statusCode=400;
                      throw err;
                  }
                  next();
                }
             else if (err.message === "jwt expired")
                return res.status(403).json({message: "Access token expired"});
             else 
                return res.status(402).json({message: "User not authenticated" });
            }
            catch(err){
              err.statusCode=450;
              throw err;
            }
          })
        }
    }
    catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }

};
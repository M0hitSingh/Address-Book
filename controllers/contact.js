const { async } = require('regenerator-runtime');
const contact = require('../models/contacts');
const { findOne, findById } = require("../models/user");
const user = require('../models/user');


const csvv = require("csvtojson");
const path = require("path")
exports.csvtojson = async(req,res,next)=>{
  try{
    // console.log(req.files)
    const userid = req.user.id;
    const name =req.files.csv
    var arrayToInsert = [];
    uploadPath = path.join(__dirname,'../','csv',name.name)
    name.mv(uploadPath,async function(err) {
      if (err)
        return res.status(500).send(err);
    
      const source = await csvv().fromFile(uploadPath)
        if(source)
        {
             // Fetching the all data from each row
            for (var i = 0; i < source.length; i++) {
            var oneRow = {
                userID:userid,
                name: source[i]["name"],
                phone_no: source[i]["phone_no"],
                address: source[i]["address"]
            }; 
                // console.log(oneRow)
                arrayToInsert[i]=oneRow;
           }
           
        // console.log(arrayToInsert)
           contact.insertMany(arrayToInsert);  
           res.send('File uploaded!') 
           }
           else{
            const err = new Error('Not an Admin');
            err.statusCode = 422;
            throw err;
           }
       
    })
}
  catch(err){
    if(!err.statusCode) 
    err.statusCode = 500; 
    next();
  }
}


exports.bulkContact = async (req,res,next)=>{
    try{
        const userid = req.user.id;
        const name = req.file;
        console.log(name);
        const csvArray = [];
        uploadPath= path.join(__dirname,'../','csv',name.name);
        name.mv(uploadPath,async function(err){
            if(err){
                const error = new Error();
                throw error;
            }
            const source = await csvtojson().fromFile(uploadPath)
            if(source){                                                                // fetching data from each row
                for(var i =0 ; i <source.length; ++i){
                    var onerow = {
                        userID:userid,
                        name: source[i]["name"],
                        phone_no: source[i]["phone_no"],
                        address: source[i]["address"]
                    }
                    csvArray[i]=onerow;
                }
                contact.insertMany(csvArray);
                return res.status(202).json('Bulk Contact Uploaded')
            }
            else{
                const err = new Error
                throw err;
            }
        })
    }
    catch(err){
        next(err);
    }
}
exports.addContact = async (req, res,next)=>{
    try{
        const userid = req.user._id;
        const name = req.body.name;
        const phone_no = req.body.PhoneNumber;
        const address = req.body.address;
        const userdetail = await user.findById(userid);
        const contactdetail = await contact.find({userID:userid,name:name,phone_no:phone_no});
        if(contactdetail.length){
            const error = new Error('Already Exist');
            error.statusCode = 422;
            throw error;
        }
        const cont = new contact({
            userID:userid,
            name:name,
            phone_no:phone_no,
            address: address
        })
        await cont.save();
        userdetail.phoneBook.push(cont);
        await userdetail.save();
        return res.status(201).json(cont);
    }
    catch(err){
        next(err);
    }
}

exports.findContact = async (req,res,next)=>{
    try{
        const userid = req.user._id;
        userdetail =await user.findById(userid);
        if(!userdetail){
            const error = new Error('Not Found');
            error.statusCode = 404;
            throw error;
        }
        return res.status(202).json(userdetail);
    }
    catch(err){
        next(err);
    }
}

exports.search = async(req ,res,next)=>{
    try{
        const search = req.query.search;
        contact.find({$or:[
            {
                $and:[{name:{$regex:search,$options:"i"}}]
            },
            {
                $and:[{phone_no:{$regex:search,$options:"i"}}]
            }
        ]},(err,item)=>{
            if(err) return res.json(err);
            else return res.json(item);
        }).sort({item:1})
    }
    catch(err){
        next(err);
    }
}
exports.update = async (req,res,next)=>{
    try{
        const userid = req.user._id;
        const updateid = req.body.id;
        const name = req.body.name;
        const phone_no = req.body.phone_no;
        const address = req.body.address;
        const contactUpdate = {
            name:name,
            phone_no:phone_no,
            address:address
        }
        const result = await contact.findOneAndUpdate({_id:updateid,userID:userid},contactUpdate);
        if(!result){
            const error = new Error('Not Found');
            error.statusCode = 404;
            throw error;
        }
        return res.status(204).json("done");
    }
    catch(err){
        next(err);
    }
}
exports.getContact = async(req,res,next)=>{
    try{
        const page = req.query.page;
        const limit = req.query.limit;
        const userid = req.user._id;
        const result = await contact.find().limit(limit*1).skip((page-1)*limit)
        res.status(202).json({"pageNo":page,result});
    }
    catch(err){
        next(err);
    }
}
//pull
exports.delete = async (req,res,next)=>{
    try{
        const userid = req.user._id;
        const deleteid = req.params.id;
        const result = await contact.findOneAndDelete({_id:deleteid,userID:userid});
        if(!result){
            const error = new Error('Not Found');
            error.statusCode = 404;
            throw error;
        }
        await user.updateOne({_id:userid},{$pull:{phoneBook:deleteid}});
        return res.status(204).json("done");
    }
    catch(err){
        next(err);
    }
}
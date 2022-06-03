const contact = require('../models/contacts');
const user = require('../models/user');
const express = require('express');
const app = express();

const { validationResult, body } = require('express-validator');
const mongoose = require('mongoose');
const fileup = require("express-fileupload");
app.use(fileup())

const csvtojson = require("csvtojson");
const path = require("path");



exports.addContact = async (req, res,next)=>{                         // For adding Single Contact in contact model
    try{
        const userid = req.user._id;
        const name = req.body.name;
        const phone_no = req.body.PhoneNumber;
        const address = req.body.address;
        const userdetail = await user.findById(userid);
        const contactdetail = await contact.find({userID:userid,name:name,phone_no:phone_no});
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation failed,please enter 10 digit no');
            error.status = 422;
            throw error;
        }
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

exports.bulkContact = async (req,res,next)=>{                                       // For uploading bulk contact in contact model 
    try{
        const userid = req.user.id;
        const name = req.file;  
        const csvArray = [];
        userdetail = await user.findById(userid);
        if(!userdetail) return res.status(404).json('User Not Found');
        uploadPath= path.join(__dirname,'../','csv',name.originalname);
            const source = await csvtojson().fromFile(uploadPath)
            if(source){                                                               
                for(var i =0 ; i <source.length; ++i){   
                    const id = new mongoose.Types.ObjectId();                                     // fetching data from each row
                    var onerow = {
                        _id:id,
                        userID:userid,
                        name: source[i]["name"],
                        phone_no: source[i]["phone_no"],
                        address: source[i]["address"]
                    }
                    userdetail.phoneBook.push(id);
                    await userdetail.save();
                    csvArray[i]=onerow;
                }
                contact.insertMany(csvArray);
                return res.status(202).json('Bulk Contact Uploaded')
            }
            else{
                const err = new Error
                throw err;
            }
    }
    catch(err){
        next(err);
    }
}
exports.findContact = async (req,res,next)=>{                           // Finding Contact in Contact model for respective user
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

exports.search = async(req ,res,next)=>{                    // phase searching on phone number or contact name 
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
exports.update = async (req,res,next)=>{                    //updating single contact in contact model for respective user
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
exports.getContact = async(req,res,next)=>{                                     // fetching contact list for respective user in page 
    try{
        const page = req.query.page;
        const limit = req.query.limit;          // set limit to view contacts limited contact in single page
        const userid = req.user._id;
        const result = await contact.find().limit(limit*1).skip((page-1)*limit)
        res.status(202).json({"pageNo":page,result});
    }
    catch(err){
        next(err);
    }
}

exports.delete = async (req,res,next)=>{                        // deleting single contact from respective user
    try{
        const userid = req.user._id;
        const deleteid = req.params.id;
        const result = await contact.findOneAndDelete({_id:deleteid,userID:userid});
        if(!result){
            const error = new Error('Not Found');
            error.statusCode = 404;
            throw error;
        }
        await user.updateOne({_id:userid},{$pull:{phoneBook:deleteid}});           // pulling its contact object id from user phoneBook array
        return res.status(204).json("done");
    }
    catch(err){
        next(err);
    }
}
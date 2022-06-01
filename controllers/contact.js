const { result } = require("lodash");
const { id } = require("prelude-ls");
const { async } = require("regenerator-runtime");
const contact = require('../models/contacts');
const { findOne, findById } = require("../models/user");
const user = require('../models/user');
const multer = require('../utils/multer');


exports.bulkContact = async (req,res,next)=>{
    const userid = req.body.id;
    contact.findOne({userid:id})
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
        return res.status(204).json("done");
    }
    catch(err){
        next(err);
    }
}
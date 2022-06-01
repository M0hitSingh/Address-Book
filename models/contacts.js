const { string } = require("assert-plus");
const { address } = require("ip");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const contactSchema = new schema({
    userID:{
        type:String,
        required:true
    },
    name: {
        type : String,
        required : true
    },
    phone_no :{
        type: String,
        required: true
    },
    address : {
        type: String
    }
})
module.exports = mongoose.model("contacts",contactSchema);
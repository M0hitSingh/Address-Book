const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    fullname : {
        type : String,
        required : true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    Phno: {
        type : String,
        required: true
    },
    phoneBook: {
        type:schema.Types.ObjectId,
        ref:"contacts"
    }
})
module.exports = mongoose.model("User",userSchema);
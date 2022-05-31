const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    fullname : {
        type : String,
        required:true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
    },
    Phno: {
        type : String,
    },
    phoneBook: {
        type:schema.Types.ObjectId,
        ref:"contacts"
    },
    verified: {
        type : String,
        default : false
    }
})
module.exports = mongoose.model("User",userSchema);
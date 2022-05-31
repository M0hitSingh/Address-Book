const mongoose = require("mongoose");
const schema = mongoose.Schema;

const contactSchema = new schema({
    name: {
        type : String,
        required : true
    },
    phone_no :{
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Contacts",contactSchema);
const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const AdminSchema= mongoose.Schema({
    Department:{
        type: "string",
        require: "true"
    },
    phone:{
        type: "string",
        require: "true",
        unique: "true"
    }
   
});
AdminSchema.plugin(uniqueValidator);
module.exports=AdminSchema;
const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const AdminSchema= mongoose.Schema({
    name:{
        type: "string",
        require: "true"
    },
    username:{
        type: "string",
        require: "true",
        unique: "true"
    },
    password:{
        type:"string",
        require: "true"
    }
   
});
AdminSchema.plugin(uniqueValidator);
module.exports=AdminSchema;
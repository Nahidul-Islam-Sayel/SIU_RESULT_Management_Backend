const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const BloodSchema= mongoose.Schema({
    name:{
        type: "string",
        require: "true"
    },
    email:{
        type: "string",
        require: "true",
        unique: "true",
    },
    phone:{
        type: "number",
        require: "true"
    },
    city:{
        type:"string",
        require: "true"
    },
    group:{
        type:"string",
        require: "true"
    }
});
BloodSchema.plugin(uniqueValidator);
module.exports=BloodSchema;
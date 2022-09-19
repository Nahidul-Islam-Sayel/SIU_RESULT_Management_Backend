const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const DoctorSchema= mongoose.Schema({
    name:{
        type: "string",
        require: "true"
    },
    username:{
        type: "string",
        require: "true",
        unique: "true"
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
    Registation:{
        type: "number",
        require: "true"
    },
    address:{
        type: "string",
        require: "true"
    },
    password:{
        type:"string",
        require: "true"
    },
    confirmpassword:{
        type:"string",
        require: "true"
    },
});
DoctorSchema.plugin(uniqueValidator);
module.exports=DoctorSchema;
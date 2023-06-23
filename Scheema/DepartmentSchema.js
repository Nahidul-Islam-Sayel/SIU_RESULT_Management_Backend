const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const DoctorSchema= mongoose.Schema({
    Departmentname:{
        type: "string",
        require: "true"
    },
  
    password:{
        type:"string",
        require: "true"
    }
});
DoctorSchema.plugin(uniqueValidator);
module.exports=DoctorSchema;
const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const ResultSchema= mongoose.Schema({
    Semister:{
        type: "string",
        require: "true"
    },
    Roll:{
        type: "string",
        require: "true"
    },
    Credit:{
        type:"string",
        require: "true"
    },
    Course:{
        type: "string",
        require: "true",
       
    },
    CGPA:{
        type: "string",
        require: "true",
       
    }
   
});
ResultSchema.plugin(uniqueValidator);
module.exports=ResultSchema;
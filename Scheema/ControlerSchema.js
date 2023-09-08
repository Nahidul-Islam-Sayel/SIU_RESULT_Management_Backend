const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const  ControlerSchema= mongoose.Schema({
    name:{
        type: "string",
        require: "true"
    },
    password:{
        type:"string",
        require: "true"
    }
   
});
ControlerSchema.plugin(uniqueValidator);
module.exports=ControlerSchema;
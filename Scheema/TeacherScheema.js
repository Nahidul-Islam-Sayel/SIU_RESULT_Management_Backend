const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const TeacherScheema= mongoose.Schema({
    name:{
        type: "string",
        require: "true",
    },
    username:{
        type: "string",
        require: "true",
        unique: "true",
    },
    email:{
        type: "string",
        require: "true",
        unique: "true",
    },
    position:{
        type:"string",
        require: "true",
        
    },
    password:{
        type:"string",
        require: "true"
    },
    department:{
        type:"string",
        require: "true",
    }
});
TeacherScheema.plugin(uniqueValidator);
module.exports=TeacherScheema;
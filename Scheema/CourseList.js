const mongoose =  require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const CourseListSchema= mongoose.Schema({
   
    CourseName:{
        type: "string",
        require: "true",
        unique: "true",
    },
    CourseTitle:{
        type: "string",
        require: "true",
        unique: "true",
       
    },
    CreditHours:{
        type: "string",
        require: "true"
    },
    semister:{
        type: "string",
        require: "true"  
    }
});
CourseListSchema.plugin(uniqueValidator);

module.exports=CourseListSchema;
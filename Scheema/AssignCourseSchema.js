const mongoose =  require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const AssignCourse= mongoose.Schema({
    courseName:{
        type: "string",
        require: "true",
        unique: "true",
    },
    teachersName:{
        type: "string",
        require: "true",
       
    },
    semester: [
        {
          batch: {
            type: String,
            required: true,
          },
          semester: {
            type: String,
            required: true,
          },
        },
      ],
      department:{
        type: "string",
        require: "true"  
    }
});
AssignCourse.plugin(uniqueValidator);

module.exports=AssignCourse;
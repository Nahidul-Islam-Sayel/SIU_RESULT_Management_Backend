const mongoose =  require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const AssignRetakeReffredCourse= mongoose.Schema({
    courseName:{
        type: "string",
        require: "true",
    
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
          roll: {
            type: String,
            batch: true,
            unique: "true",
          },  
          registration: {
            type: String,
            required: true,
            unique: "true",
          },  
          retakeReferral: {
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
AssignRetakeReffredCourse.plugin(uniqueValidator);

module.exports=AssignRetakeReffredCourse;
const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const AddNumberSchema = mongoose.Schema({
    Sessional: {
        type: Number,
        required: true,
    },
    Midterm: {
        type: Number,
        required: true,
    },
    Final: {
        type: Number,
        required: true,
    },
    Total: {
        type: Number,
        required: true,
    },
    Roll: {
        type: Number,
        required: true,
    },
    CourseCode: {
        type: String,
        required: true,
    },
    Semester:{
        type: Number,
        required: true,
    },
    Name:{
        type: String,
        required: true,
    },
    Reg:{
        type: Number,
        required: true,
    },
    CourseHoure:{
        type: String,
        required: true,
    }    
});


AddNumberSchema.index({ Roll: 1, CourseCode: 1 }, { unique: true });

AddNumberSchema.plugin(uniqueValidator);
module.exports=AddNumberSchema;
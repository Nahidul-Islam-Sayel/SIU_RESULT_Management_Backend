const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const PublisedResultSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        required: true
    },
    reg: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    }
});




PublisedResultSchema.plugin(uniqueValidator);
module.exports = PublisedResultSchema;

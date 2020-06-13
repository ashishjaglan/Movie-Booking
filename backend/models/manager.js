const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const managerSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    cityId: { type: String }
});

managerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Manager', managerSchema);
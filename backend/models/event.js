const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    cityId: { type: String, required: true },
    name: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    imagePath: { type: String, required: true }
});

eventSchema.index({cityId: 1});


module.exports = mongoose.model('Event', eventSchema);
const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    cityId: { type: String, required: true },
    name: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    imagePath: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

movieSchema.index({cityId: 1, timestamp: 1});


module.exports = mongoose.model('Movie', movieSchema);
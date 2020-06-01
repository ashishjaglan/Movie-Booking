const mongoose = require('mongoose');

const hallSchema = mongoose.Schema({
    theatreId: { type: String, required: true },
    name: { type: String, required: true },
    seats: { type: [Number], required: true },
    cols: { type: Number, required: true }
});

hallSchema.index({theatreId: 1});

module.exports = mongoose.model('Hall', hallSchema);
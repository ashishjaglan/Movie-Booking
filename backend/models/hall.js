const mongoose = require('mongoose');

const hallSchema = mongoose.Schema({
    theatreId: { type: String, required: true },
    name: { type: String, required: true },
    rows: { type: [String], required: true },
    cols: { type: [String], required: true }
});

hallSchema.index({theatreId: 1});

module.exports = mongoose.model('Hall', hallSchema);
const mongoose = require('mongoose');

const theatreSchema = mongoose.Schema({
    cityId: { type: String, required: true },
    name: { type: String, required: true }
});

theatreSchema.index({cityId: 1});

module.exports = mongoose.model('Theatre', theatreSchema);
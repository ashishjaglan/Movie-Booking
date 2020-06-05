const mongoose = require('mongoose');

const Booking = require("../models/show");

const showSchema = mongoose.Schema({
    sourceId: { type: String, required: true },
    theatreName: { type: String, required: true },
    hallId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
    seats: { type: [Number], required: true },
    cols: { type: Number, required: true },
    bookings: { type: [Booking] }
});

showSchema.index({sourceId: 1, startTime: 1, hallId: 1});


module.exports = mongoose.model('Show', showSchema);
const mongoose = require('mongoose');

const Booking = require("../models/show");

const showSchema = mongoose.Schema({
    sourceId: { type: String, required: true },
    theatreName: { type: String, required: true },
    hallId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
    seats: { type: [Number], required: true },
    cols: { type: Number, required: true },
    bookings: { type: [Booking] }
});

showSchema.index({sourceId: 1, hallId: 1});
//bookingSchema.index({userId: 1});


module.exports = mongoose.model('Show', showSchema);
//module.exports = mongoose.model('Booking', bookingSchema);
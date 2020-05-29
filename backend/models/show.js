const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    bookedSeats: { type: [String], required: true },
    totalPayment: { type: Number, required: true }
});

const showSchema = mongoose.Schema({
    sourceId: { type: String, required: true },
    theatreName: { type: String, required: true },
    hallId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
    rows: { type: [String], required: true },
    cols: { type: [String], required: true },
    reservedSeats: { type: [String] },
    bookings: { type: [bookingSchema] }
});

showSchema.index({sourceId: 1, hallId: 1});


module.exports = mongoose.model('Show', showSchema);
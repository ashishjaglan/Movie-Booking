const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    showId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true },
    bookedSeats: { type: [Number], required: true },
    totalPayment: { type: Number, required: true },
    timeStamp: { type: Date, required: true }
});

bookingSchema.index({status: 1, timeStamp: 1});

module.exports = mongoose.model('Booking', bookingSchema);
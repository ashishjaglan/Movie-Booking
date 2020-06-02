const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    bookedSeats: { type: [Number], required: true },
    totalPayment: { type: Number, required: true }
});

bookingSchema.index({userId: 1});

module.exports = mongoose.model('Booking', bookingSchema);
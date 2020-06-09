const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    bookingId: { type: String, required: true },
    userId: { type: String, required: true },
    sourceName: { type: String, required: true },
    imagePath: { type: String, required: true },
    startTime: { type: Date, required: true },
    theatreName: { type: String, required: true },
    hallName: { type: String, required: true },
    bookedSeats: { type: [String], required: true },
    totalPayment: { type: Number, required: true },
    timeStamp: { type: Date, required: true }
});

historySchema.index({userId: 1, timeStamp: 1});

module.exports = mongoose.model('History', historySchema);
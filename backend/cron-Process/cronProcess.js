const express = require("express");

const Booking = require("../models/booking");
const Show = require("../models/show");
const cron = require('node-cron');

cron.schedule('* * * * *', function() {
    console.log("cron running");
    
    expiryTime = new Date();
    expiryTime.setTime(expiryTime.getTime() - 10*60*1000);
    Booking.find({ status: "active", timeStamp: { $lte: expiryTime } }, "_id")
    .then(documents => {
        if(documents != null){
            for(const document of documents){
                const start = async function(bookingId){
                    await discardBooking(document._id);
                }
                start();
            }
        }
    })
    .catch(err => {
        console.log(err);        
    });
        
});


const discardBooking = async function(bookingId) {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
      const opts = { session };
      const expiredBooking = await Booking.findByIdAndUpdate(bookingId, {status: "expired"}, {useFindAndModify: false, opts});

        var setSeatsSelection = {};

        for(var i = 0; i < expiredBooking.bookedSeats.length; i++) {
        setSeatsSelection['seats.' + expiredBooking.bookedSeats[i]] = 0;
        }
  
      await Show.findByIdAndUpdate(expiredBooking.showId, { 
        $set: setSeatsSelection ,
        $inc: { seatsAvailable: +expiredBooking.bookedSeats.length }
        },{useFindAndModify: false, opts});
  
      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (error) {
      // If an error occurred, abort the whole transaction and
      // undo any changes that might have happened
      await session.abortTransaction();
      session.endSession();
      throw error; 
    }
  }
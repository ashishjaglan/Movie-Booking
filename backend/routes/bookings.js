const express = require("express");

const Show = require("../models/show");
const Booking = require("../models/booking");

const router = express.Router();

router.post("", (req, res, next) => {

    var seatsQuery = [];
    var setSeatsSelection = {};

    const booking=new Booking({
        showId: req.body.showId,
        userId: req.body.userId,
        status: "active",
        bookedSeats: req.body.bookedSeats,
        totalPayment: req.body.totalPayment,
        timeStamp: new Date()
    });

    for(var i = 0; i < booking.bookedSeats.length; i++) {
        var seatSelector = {};
        var seatSelection = 'seats.' + booking.bookedSeats[i];
        
        seatSelector[seatSelection] = 0;
        seatsQuery.push(seatSelector);
        
        setSeatsSelection[seatSelection] = 1;  
      }

    // booking.save().then(document => {
    //     bookingTimestamp = document.timeStamp;
    //     console.log(document);          
    // });
      
    Show.findOneAndUpdate({_id:req.body.showId, $and: seatsQuery}, {
        $set: setSeatsSelection,
        $inc: { seatsAvailable: -booking.bookedSeats.length }
    },  {useFindAndModify: false})
    .then(document => {
        if(document == null){
            res.status(409).json({
                message: "Booking unsuccessful!"
            });
        }else{
            booking.save().then(document => {
                res.status(200).json({
                    message: 'Booking done successfully!',
                    bookingId: document._id
                });     
            });
        }
    })
    .catch(err => {
        return res.status(406).json({
            message: err.toString()
        });
    });
    
});

router.get("/:id", (req, res, next) => {
    Booking.findById(req.params.id).then(booking => {
        if(booking){
            res.status(200).json(booking);
        }else{
            res.status(404).json({ message: 'Booking not found!'});
        }
    })
});

router.patch("/:id", (req, res, next) => {
    if(req.body.status=="success"){
        Booking.findByIdAndUpdate(req.params.id, {status: req.body.status}, {useFindAndModify: false})
        .then((booking) => {
            console.log(booking);        
        })
        .catch((err) => {
            res.status(404).json({ message: 'Booking not found!'});
        });
    }else if(req.body.status=="cancelled"){
        const start = async function(bookingId){
            await cancelBooking(req.params.id);
        }
        start();
    }
    
});

const cancelBooking = async function(bookingId) {
    const session = await Booking.startSession();
    session.startTransaction();
    try {
      const opts = { session };
      const cancelledBooking = await Booking.findByIdAndUpdate(bookingId, {status: "cancelled"}, {useFindAndModify: false, opts});

        var setSeatsSelection = {};

        for(var i = 0; i < cancelledBooking.bookedSeats.length; i++) {
        setSeatsSelection['seats.' + cancelledBooking.bookedSeats[i]] = 0;
        }
  
      await Show.findByIdAndUpdate(cancelledBooking.showId, { 
        $set: setSeatsSelection ,
        $inc: { seatsAvailable: +cancelledBooking.bookedSeats.length }
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




module.exports = router;
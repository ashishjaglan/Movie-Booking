const express = require("express");

const Show = require("../models/show");
const Booking = require("../models/booking");

const router = express.Router();

// router.get("/:id", (req, res, next) => {
//     // Movie.find({cityId: req.params.id}).explain('queryPlanner').then(doc => {
//     //     console.log(doc);
//     // });    
    
//     Show.find({sourceId: req.params.id}).then(documents => { 
//         res.status(200).json({
//             message: 'Shows fetched successfully!',
//             shows: documents
//         });
//     });
    
// });

// router.get("/data/:id", (req, res, next) => {
//     Show.findById(req.params.id).then(show => {
//         if(show){
//             res.status(200).json(show);
//         }else{
//             res.status(404).json({ message: 'Show not found!'});
//         }
//     })
// });

router.post("", (req, res, next) => {

    var seatsQuery = [];
    var setSeatsSelection = {};

    const booking=new Booking({
        userId: req.body.userId,
        bookedSeats: req.body.bookedSeats,
        totalPayment: req.body.totalPayment
    });

    for(var i = 0; i < booking.bookedSeats.length; i++) {
        var seatSelector = {};
        var seatSelection = 'seats.' + booking.bookedSeats[i];
        // Part of $and query to check if seat is free
        seatSelector[seatSelection] = 0;
        seatsQuery.push(seatSelector);
        // Part of $set operation to set seat as occupied
        setSeatsSelection[seatSelection] = 1;  
      }
      
    Show.findOneAndUpdate({_id:req.body.showId, $and: seatsQuery}, {
        $set: setSeatsSelection,
        $inc: { seatsAvailable: -booking.bookedSeats.length },
        $push: { bookings: booking }
    },  {useFindAndModify: false})
    .then(document => {
        if(document == null){
            res.status(409).json({
                message: "Booking unsuccessful!"
            });
        }else{
            res.status(200).json({
                message: 'Booking done successfully!',
                bookingData: document
            });
        }
    })
    .catch(err => {
        return res.status(406).json({
            message: err.toString()
        });
    });
    
});




module.exports = router;
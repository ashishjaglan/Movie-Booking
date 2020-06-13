const express = require("express");

const Movie = require("../models/movie");
const Event = require("../models/event");
const Show = require("../models/show");
const Hall = require("../models/hall");
const Booking = require("../models/booking");
const History = require("../models/history");

const router = express.Router();

router.get("/:id", (req, res, next) => {
    const activeBookings = req.query.active;
    currentTime = new Date();
    let historyQuery ;
    if(activeBookings == 'true'){
        historyQuery= History.find({userId: req.params.id, startTime: { $gte: currentTime }}).sort( { timeStamp: -1 } );
    }else{
        historyQuery= History.find({userId: req.params.id, startTime: { $lte: currentTime }}).sort( { timeStamp: -1 } );
    }
    //History.find({userId: req.params.id, startTime: { $gte: currentTime }}).sort( { timeStamp: -1 } )
    historyQuery.then(documents => {
        res.status(200).json({
            message: 'Booking History fetched successfully!',
            histories: documents
        });
    });
    
    
});

router.post("", (req, res, next) => {
    const start = async function(bookingId, userId){
        await addBookingHistory(req.body.bookingId, req.body.userId);
    }
    start();
    res.status(200).json({
        message: 'History added successfully!',
    });
    
});

const addBookingHistory = async function(bookingId, userId) {
    try {
      const fetchedBookingData = await Booking.findById(bookingId);
      const fetchedShowData = await Show.findById(fetchedBookingData.showId);
      const fetchedHallName = await Hall.findById(fetchedShowData.hallId, 'name');
      var fetchedSourceData = null;

        if(fetchedShowData.isMovie == true){
            fetchedSourceData = await Movie.findById(fetchedShowData.sourceId);
        } else {
            fetchedSourceData = await Event.findById(fetchedShowData.sourceId);
        }        

        var seats = [];
        var noOfCols = fetchedShowData.cols;

        for(var i = 0; i < fetchedBookingData.bookedSeats.length; i++) {
            var row = fetchedBookingData.bookedSeats[i] / noOfCols;
            var col = (fetchedBookingData.bookedSeats[i] % noOfCols) + 1;
            seats.push(String.fromCharCode(65+row) + col.toString());
        }

        const history=new History({
            bookingId: bookingId,
            userId: userId,
            sourceName: fetchedSourceData.name,
            imagePath: fetchedSourceData.imagePath,
            startTime: fetchedShowData.startTime,
            theatreName: fetchedShowData.theatreName,
            hallName: fetchedHallName.name,
            bookedSeats: seats,
            totalPayment: fetchedBookingData.totalPayment,
            timeStamp: new Date()
        });
  
      await history.save().then(document => {
            console.log(document);          
            
        });
  
      
      return true;
    } catch (error) {
      console.log(error);       
    }
}

router.delete("/:id", (req, res, next) => {
    History.deleteOne({_id: req.params.id}).then(result => {
        if(result.n > 0) {
            res.status(200).json({message: "History deleted!"});
        } else {
            res.status(401).json({message: "Not deleted!"});
        }
    });
    
});

module.exports = router;
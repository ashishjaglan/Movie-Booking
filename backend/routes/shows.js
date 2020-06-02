const express = require("express");

const Show = require("../models/show");
const Theatre = require("../models/theatre");

const router = express.Router();

router.get("/:id", (req, res, next) => {
    // Movie.find({cityId: req.params.id}).explain('queryPlanner').then(doc => {
    //     console.log(doc);
    // });    
    
    Show.find({sourceId: req.params.id}).then(documents => { 
        res.status(200).json({
            message: 'Shows fetched successfully!',
            shows: documents
        });
    });
    
});

router.get("/data/:id", (req, res, next) => {
    Show.findById(req.params.id).then(show => {
        if(show){
            res.status(200).json(show);
        }else{
            res.status(404).json({ message: 'Show not found!'});
        }
    })
});

router.post("", (req, res, next) => {
    //var theatreName;
    Theatre.findById(req.body.theatreData).then(theatreData => {
         //theatreName = theatreNameData;
         const show=new Show({
            sourceId: req.body.sourceId,
            theatreName: theatreData.name,
            hallId: req.body.hallId,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            price: req.body.price,
            seatsAvailable: req.body.seatsAvailable,
            seats: req.body.seats,
            cols: req.body.cols,
            bookings: [Object]
        });
        show.save().then(document => {
            res.status(200).json({
                message: 'Show added successfully!',
                show: document
            });
        });
    })
    
});




module.exports = router;
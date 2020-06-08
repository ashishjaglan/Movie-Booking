const express = require("express");

const Show = require("../models/show");
const Theatre = require("../models/theatre");

const router = express.Router();

router.get("/:id", (req, res, next) => {
    Show.find(
        {sourceId: req.params.id, startTime: { $gte: new Date() } }, 
         'theatreName startTime seatsAvailable' )
        .sort( { startTime: 1 } )
        .then(documents => { 
            res.status(200).json({
                message: 'Shows fetched successfully!',
                shows: documents
            });
        })
        .catch(err => {
            return res.status(400).json({
                message: err.toString()
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
    Theatre.findById(req.body.theatreData).then(theatreData => {
         const show=new Show({
            sourceId: req.body.sourceId,
            theatreName: theatreData.name,
            hallId: req.body.hallId,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            price: req.body.price,
            seatsAvailable: req.body.seatsAvailable,
            seats: req.body.seats,
            cols: req.body.cols
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
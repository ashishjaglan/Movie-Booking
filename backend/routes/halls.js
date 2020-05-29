const express = require("express");

const Hall = require("../models/hall");

const router = express.Router();

router.get("/:id", (req, res, next) => {
    Hall.find({theatreId: req.params.id}).then(documents => { 
        res.status(200).json({
            message: 'Halls fetched successfully!',
            halls: documents
        });
    });
    
});

router.get("/data/:id", (req, res, next) => {
    Hall.findById(req.params.id).then(hall => {
        if(hall){
            res.status(200).json(hall);
        }else{
            res.status(404).json({ message: 'Hall not found!'});
        }
    })
});

router.post("", (req, res, next) => {
    const hall=new Hall({
        theatreId: req.body.theatreId,
        name: req.body.name,
        rows: req.body.rows,
        cols: req.body.cols        
    });
    hall.save().then(document => {
        res.status(200).json({
            message: 'Hall added successfully!',
            hall: document
        });
    });
});




module.exports = router;
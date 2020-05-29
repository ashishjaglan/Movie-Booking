const express = require("express");

const Theatre = require("../models/theatre")

const router = express.Router();

router.get("/:id", (req, res, next) => {
    Theatre.find({cityId: req.params.id}).then(documents => { 
        res.status(200).json({
            message: 'Theatres fetched successfully!',
            theatres: documents
        });
    });
    
});

router.post("", (req, res, next) => {
    const theatre=new Theatre({
        cityId: req.body.cityId,
        name: req.body.name
    });
    theatre.save().then(document => {
        res.status(200).json({
            message: 'Theatre added successfully!',
            theatre: document
        });
    });
});




module.exports = router;
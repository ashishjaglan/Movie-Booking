const express = require("express");

const City = require("../models/city");

const router = express.Router();

router.get("", (req, res, next) => {
    City.find().then(documents => {
        res.status(200).json({
            message: 'Cities fetched successfully!',
            cities: documents
        });
    });
    
    
});

router.post("", (req, res, next) => {
    const city=new City({
        name: req.body.name
    });
    city.save().then(document => {
        res.status(200).json({
            message: 'Cities added successfully!',
            city: document
        });
    });
});




module.exports = router;
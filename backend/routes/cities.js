const express = require("express");

const City = require("../models/city");
const Manager = require("../models/manager");

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
        name: req.body.cityName
    });
    let cityId = "";
    
    City.find({name: req.body.cityName})
    .then((document) => {
        console.log(document);
        if(document.length){
            res.status(200).json({
                message: 'City already has a manager',                
                city: document
            });
        }else{
            city.save().then(cityDocument => {
                cityId = cityDocument._id;
                Manager.findByIdAndUpdate(req.body.managerId, {cityId: cityDocument._id}, {useFindAndModify: false})
                .then((document) => {
                    res.status(200).json({
                        message: 'City added successfully!',
                        cityId: cityId
                    });
                });
                
            });
            
        }
        
    });

    // city.save().then(document => {
    //     res.status(200).json({
    //         message: 'City added successfully!',
    //         city: document
    //     });
    // });
});




module.exports = router;
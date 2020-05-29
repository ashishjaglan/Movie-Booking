const express = require("express");

const Movie = require("../models/movie");

const router = express.Router();

router.get("/:id", (req, res, next) => {
    // Movie.find({cityId: req.params.id}).explain('queryPlanner').then(doc => {
    //     console.log(doc);
    // });    

    Movie.find({cityId: req.params.id}).then(documents => { 
        res.status(200).json({
            message: 'Movies fetched successfully!',
            movies: documents
        });
    });
    
});


router.post("", (req, res, next) => {
    const movie=new Movie({
        cityId: req.body.cityId,
        name: req.body.name,
        language: req.body.language,
        description: req.body.description,
        duration: req.body.duration,
        imagePath: req.body.imagePath
    });
    movie.save().then(document => {
        res.status(200).json({
            message: 'Movie added successfully!',
            movie: document
        });
    });
});




module.exports = router;
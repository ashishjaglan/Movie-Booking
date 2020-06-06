const express = require("express");

const Movie = require("../models/movie");

const router = express.Router();

router.get("/:id", (req, res, next) => {
    // Movie.find({cityId: req.params.id}).explain('queryPlanner').then(doc => {
    //     console.log(doc);
    // });  
    
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const movieQuery = Movie.find({cityId: req.params.id}, 'name language imagePath').sort( { timestamp: -1 } );
    let fetchedMovies;
    if(pageSize && currentPage){
        movieQuery
        .skip(pageSize* ( currentPage - 1 ))
        .limit(pageSize);
    }
    movieQuery.then(documents => {
        fetchedMovies = documents;
        return Movie.countDocuments({cityId: req.params.id});
    })
    .then(count => {
        return res.status(200).json({
            message: 'Movies fetched successfully!',
            movies: fetchedMovies,
            maxMovies: count
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
        imagePath: req.body.imagePath,
        timestamp: req.body.timestamp
    });
    movie.save().then(document => {
        res.status(200).json({
            message: 'Movie added successfully!',
            movie: document
        });
    });
});




module.exports = router;
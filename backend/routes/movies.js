const express = require("express");
const multer = require("multer");

const Movie = require("../models/movie");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
            error=null;
        }
        cb(error, "backend/images");     //path relative to server.js
    },
    filename: (rq, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

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

router.get("/data/:id", (req, res, next) => {
    Movie.findById(req.params.id).then(movie => {
        if(movie){
            res.status(200).json(movie);
        }else{
            res.status(404).json({ message: 'Movie not found!'});
        }
    })
});

router.get("/manager/:id", (req, res, next) => {
    Movie.find({cityId: req.params.id}, 'name duration').sort( { name: 1 } ).then(movies => {
        if(movies){
            res.status(200).json({
                message: "Movies fetched successfully",
                movies: movies
            });
        }else{
            res.status(404).json({ message: 'Movies not found!'});
        }
    })
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

router.post(
    "/imageUpload",
    multer({storage: storage}).single("imagePath") , (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const movie=new Movie({
        cityId: req.body.cityId,
        name: req.body.name,
        language: req.body.language,
        description: req.body.description,
        duration: req.body.duration,
        imagePath: url + "/images/" + req.file.filename,
        timestamp: new Date()
    });
    movie.save().then(document => {
        res.status(200).json({
            message: 'Movie added successfully!',
            movie: document
        });
    });
});




module.exports = router;
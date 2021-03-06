const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, )
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
            name: req.body.name
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: "User created",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                    message: "Invalid authentication credentials!"
            });
        });
    });    
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
    .then( user => {
        if(!user){
            throw new Error('User not found');
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).
    then( result => {
        if(!result){
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id, userName: fetchedUser.name}, 
            'the_long_string_for_security_purpose_to_be_passed_here', 
            { expiresIn: '1h' }
            );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            username: fetchedUser.name
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: err.toString()
        });
    })
    ;
});

module.exports = router;
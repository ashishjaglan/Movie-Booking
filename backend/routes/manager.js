const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Manager = require("../models/manager");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, )
    .then(hash => {
        const manager = new Manager({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            cityId: ""
        });
        manager.save()
        .then(result => {
            res.status(201).json({
                message: "Manager created",
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
    let fetchedManager;
    Manager.findOne({ email: req.body.email })
    .then( manager => {
        if(!manager){
            throw new Error('Manager not found');
        }
        fetchedManager = manager;
        return bcrypt.compare(req.body.password, manager.password);
    }).
    then( result => {
        if(!result){
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }
        const token = jwt.sign({ email: fetchedManager.email, managerId: fetchedManager._id, managerName: fetchedManager.name}, 
            'the_long_string_for_security_purpose_to_be_passed_here', 
            { expiresIn: '1h' }
            );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            managerId: fetchedManager._id,
            managername: fetchedManager.name,
            managerCityId: fetchedManager.cityId
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
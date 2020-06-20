const express = require("express");

const Event = require("../models/event");

const router = express.Router();

router.get("/:id", (req, res, next) => {    
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const eventQuery = Event.find({cityId: req.params.id}, 'name language imagePath').sort( { timestamp: -1 } );
    let fetchedEvents;
    if(pageSize && currentPage){
        eventQuery
        .skip(pageSize* ( currentPage - 1 ))
        .limit(pageSize);
    }
    eventQuery.then(documents => {
        fetchedEvents = documents;
        return Event.countDocuments({cityId: req.params.id});
    })
    .then(count => {
        return res.status(200).json({
            message: 'Events fetched successfully!',
            events: fetchedEvents,
            maxEvents: count
        });
    });

});

router.get("/data/:id", (req, res, next) => {
    Event.findById(req.params.id).then(event => {
        if(event){
            res.status(200).json(event);
        }else{
            res.status(404).json({ message: 'Event not found!'});
        }
    })
});

router.get("/manager/:id", (req, res, next) => {
    Event.find({cityId: req.params.id}, 'name duration').sort( { name: 1 } ).then(events => {
        if(events){
            res.status(200).json({
                message: "Events fetched successfully",
                events: events
            });
        }else{
            res.status(404).json({ message: 'Events not found!'});
        }
    })
});


router.post("", (req, res, next) => {
    const event=new Event({
        cityId: req.body.cityId,
        name: req.body.name,
        language: req.body.language,
        description: req.body.description,
        duration: req.body.duration,
        imagePath: req.body.imagePath,
        timestamp: req.body.timestamp
    });
    event.save().then(document => {
        res.status(200).json({
            message: 'Event added successfully!',
            event: document
        });
    });
});




module.exports = router;
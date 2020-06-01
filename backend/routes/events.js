const express = require("express");

const Event = require("../models/event");

const router = express.Router();

router.get("/:id", (req, res, next) => {    
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const eventQuery = Event.find({cityId: req.params.id});
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


router.post("", (req, res, next) => {
    const event=new Event({
        cityId: req.body.cityId,
        name: req.body.name,
        language: req.body.language,
        description: req.body.description,
        duration: req.body.duration,
        imagePath: req.body.imagePath
    });
    event.save().then(document => {
        res.status(200).json({
            message: 'Event added successfully!',
            event: document
        });
    });
});




module.exports = router;
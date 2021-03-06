const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cityRoutes = require("./routes/cities");
const movieRoutes = require("./routes/movies");
const eventRoutes = require("./routes/events");
const theatreRoutes = require("./routes/theatres");
const hallRoutes = require("./routes/halls");
const showRoutes = require("./routes/shows");
const bookingRoutes = require("./routes/bookings");
const userRoutes = require("./routes/user");
const managerRoutes = require("./routes/manager");
const historyRoutes = require("./routes/history")
const cronProcess = require("./cron-Process/cronProcess");


const app = express();

mongoose.connect("mongodb+srv://ashish:ashish17@cluster0-hhgji.mongodb.net/main?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to db");        
    })
    .catch(() => {
        console.log("Connection failed!!");
        
    });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});


app.use("/api/city", cityRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/theatre", theatreRoutes);
app.use("/api/hall", hallRoutes);
app.use("/api/show", showRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/manager", managerRoutes);


module.exports = app;
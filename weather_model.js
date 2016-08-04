/**
 * Created by Fabian Tschullik on 17.06.2016.
 */

/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */

var mongoose = require('mongoose');
   var weatherSchema =  new mongoose.Schema({


        date_time: Date,
        city_id: Number,
        city_name: String,
        cords: {
            lon: Number,
            lat: Number
        },
        description: String,
        sunrise: Number,
        sunset: Number,

        temp: Number,
        temp_min: Number,
        temp_max: Number,
        rain: String,
        clouds: Number


    });

    var Weather = module.exports = mongoose.model('Weather', weatherSchema);
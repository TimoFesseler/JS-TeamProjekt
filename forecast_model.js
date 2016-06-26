/**
 * Created by Fabian Tschullik on 17.06.2016.
 */

/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */



var mongoose = require('mongoose');
   var forecastSchema =  new mongoose.Schema({


         date_time: Date,
                city_id: Number,
                city_name: String,
                cords: {
                    lon: Number,
                    lat: Number
                },
                forecast: []


 });



    var Forecast = module.exports = mongoose.model('Forecast', forecastSchema);
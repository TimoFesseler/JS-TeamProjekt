/**
 * Created by Fabian Tschullik on 18.06.2016.
 */


var mongoose = require('mongoose');
   var Schema = mongoose.Schema;
   var weatherSchema = mongoose.Schema({


        date_time: Date,
        city_id: Number,
        city_name: String,
        cords: {
            lon: Number,
            lat: Number
        },
        sunrise: Number,
        sunset: Number,

        temp: Number,
        temp_min: Number,
        temp_max: Number,
        rain: String,
        clouds: Number


    });

    module.exports = mongoose.model('weather', weatherSchema);
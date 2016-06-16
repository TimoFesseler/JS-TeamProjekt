var mongoose = require('mongoose');
var cityID = '2848175';
var token = '1ccf6bfbf52e4b3abadde9b4125547d3';
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?id=';
var db = mongoose.connection;
var request = require('request');

mongoose.connect('mongodb://87.106.111.229/test');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to DBll");

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


    var Weather = mongoose.model('weather', weatherSchema);

    request(apiUrl + cityID + '&APPID=' + token, function (error, response, body) {
        if (!error) {

            var data = JSON.parse(body);


            var weather = new Weather(
                {
                    date_time: new Date(),
                    city_id: data.id,
                    city_name: data.name,
                    cords: {
                        lon: data.coord.lon,
                        lat: data.coord.lat
                    },
                    sunrise: data.sys.sunrise,
                    sunset: data.sys.sunset,
                    temp: (data.main.temp - 273.15),
                    temp_min: (data.main.temp_min - 273.15),
                    temp_max: (data.main.temp_max - 273.15),
                    rain: data.rain['1h'],
                    clouds: data.clouds.all
                });

            console.log(weather);

            weather.save(function (err, weather) {

                if (err) return console.error(err);
                if (!err) mongoose.connection.close();

            });

        }
        
    });

});

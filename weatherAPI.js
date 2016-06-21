var request = require('request');
var Weather = require('./weather_model.js');
var cityID = '2848175';
var token = '1ccf6bfbf52e4b3abadde9b4125547d3';
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?id=';
var mongoose = require('mongoose');
var db = mongoose.connection;
var weatherData = null;



module.exports =
{


getActualWeather: function (callback) {


mongoose.createConnection('mongodb://87.106.111.229/test');




    request(apiUrl + cityID + '&APPID=' + token, function (error, response, body) {
        if (!error) {

            var data = JSON.parse(body);
            
            console.log(body);

console.log(data);
            var weatherData = new Weather(
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
                    rain: data.rain['3h'],
                    clouds: data.clouds.all
                });


    weatherData.save(function (err, weather) {

                if (err) return console.error(err);
               // if (!err) mongoose.connection.close();

            });



db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to DBll");

});

        }

        callback(weatherData);


    });





}}
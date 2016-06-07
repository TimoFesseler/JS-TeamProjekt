/**
 * Created by fabiantschullik on 30.05.16.
 */


var request = require('request');

var mongodb = require('mongodb');
var assert = require('assert');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost/test';
var cityID = '2848175';
var token = '1ccf6bfbf52e4b3abadde9b4125547d3';
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?id=';



MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);


        request(apiUrl+cityID+'&APPID='+token, function (error, response, body) {
            if (!error) {


                data = JSON.parse(body);

                //console.log(body);

                var weather = {
                    'date_time': new Date(),
                    'city_id': data.id,
                    'city_name': data.name,
                    'cords': {'lon': data.coord.lon, 'lat': data.coord.lat},
                    'sunrise': data.sys.sunrise,
                    'sunset' : data.sys.sunset,

                    'weather': []

                };


                    weather.weather.push({

                        'temp': (data.main.temp - 273.15),
                        'temp_min': (data.main.temp_min - 273.15),
                        'temp_max': (data.main.temp_max - 273.15),
                        'rain': data.rain['1h'],
                        'clouds': data.clouds.all

                    });





                console.log(weather);


                var collection = db.collection('weather');
                collection.insert([weather], function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Erfolg');
                    }
                    db.close();
                });


            }


        });





    }
});
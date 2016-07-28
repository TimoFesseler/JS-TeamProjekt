/*
 ## Server-Seitig
 ++++++++   Abfrage der API: OpenWeatherMap.org   ++++++++
 ++++++++   Speicherung der Daten in einer MongoDB   ++++++++
 */


var request = require('request');

var mongodb = require('mongodb');
var assert = require('assert');
var fs = require('fs');
var loginFile = require('./SBFspot-user.json');

var logOutkey = loginFile.outkey;

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://87.106.111.229/photovoltaik';
var cityID = '2848175';
var token = logOutkey;
var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast/';
var forecast = null;


module.exports =
{

    get5DayForecast: function (callback) {

        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                //HURRAY!! We are connected. :)
                console.log('Connection established to', url);




                request(apiUrl + 'city?id=' + cityID + '&APPID=' + token + '&lang=de', function (error, response, body) {
                    if (!error) {
                        



                        data = JSON.parse(body);

                      


                        forecast = {
                            'city_id': data.city.id,
                            'city_name': data.city.name,
                            'cords': {'lon': data.city.coord.lon, 'lat': data.city.coord.lat},
                            'forecast': []

                        };


                        for (var i = 0; i < data.list.length; i++) {


                            forecast.forecast.push({

                                'date_time': data.list[i].dt_txt,
                                'temp': (data.list[i].main.temp - 273.15),
                                'clouds': data.list[i].clouds.all

                            });

                        }


                        callback(forecast);


                        var collection = db.collection('forecast');
                        collection.insert([forecast], function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Erfolg');
                            }
                            db.close();
                        });


                    }

                    if(error){

                        request(apiUrl + 'city?id=2878695'+ '&APPID=' + token + '&lang=de', function (error, response, body) {
                            if (!error) {




                                data = JSON.parse(body);




                                forecast = {
                                    'city_id': data.city.id,
                                    'city_name': data.city.name,
                                    'cords': {'lon': data.city.coord.lon, 'lat': data.city.coord.lat},
                                    'forecast': []

                                };


                                for (var i = 0; i < data.list.length; i++) {


                                    forecast.forecast.push({

                                        'date_time': data.list[i].dt_txt,
                                        'temp': (data.list[i].main.temp - 273.15),
                                        'clouds': data.list[i].clouds.all

                                    });

                                }


                                callback(forecast);


                                var collection = db.collection('forecast');
                                collection.insert([forecast], function (err, result) {
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


            }
        });


    }


};










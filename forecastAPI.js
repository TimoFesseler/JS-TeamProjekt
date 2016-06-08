var request = require('request');

var mongodb = require('mongodb');
var assert = require('assert');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost/test';
var cityID = '2848175';
var token = '1ccf6bfbf52e4b3abadde9b4125547d3';
var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast/';

function getCelsius (far){


    return  this.far;
}
console.log(getCelsius('ssss'));

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);


        request(apiUrl+'city?id='+cityID+'&APPID='+token+'&lang=de', function (error, response, body) {
            if (!error) {


                data = JSON.parse(body);

                //console.log(data);

                console.log('Stadt: ' + data.city.name);
                console.log('Stadt ID: ' + data.city.id);
                console.log('Längengrad: ' + data.city.coord.lon);
                console.log('Breitengrad: ' + data.city.coord.lat);

                console.log('Datum: ' + data.list[0].dt_txt);
                console.log('Temperatur: ' + data.list[0].main.temp);
                console.log('Wolken ' + data.list[0].clouds.all);
                console.log('Länge-Liste: ' + data.list.length);


                var forecast = {
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


                // console.log(forecast);

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


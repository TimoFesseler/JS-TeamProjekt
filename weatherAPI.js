//Verwendete Requirements
var request = require('request');
var Weather = require('./weather_model.js');
var mongoose = require('mongoose');

//Anhand der cityID wird die Abfrage an die API der openWeatherMap gestellt
var cityID = '2848175';

//Token zur Autentifizierung an der openWeatherMap-Api
var token = '1ccf6bfbf52e4b3abadde9b4125547d3';

//Abfrage von aktuellen Wetterdaten eines bestimmten Ortes
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?id=';

var db = mongoose.connection;

//Variable in der sämtliche Wetterdaten einer Abfrage gespeichert werden.
var weatherData = null;


module.exports =
{

//Funktion holt die aktuellen Wetterdaten zu einem über die City ID definierten Ort und liefert
//diese anschließend zurück. Da Wetterdaten werden ebenfalls in einer MongoDB gespeichert.        
    getActualWeather: function (callback) {


        mongoose.createConnection('mongodb://87.106.111.229/photovoltaik');

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log("Connected to DB");

        //Hier wird der String zur Abfrage zusammen gefügt und der request anschließend gestartet
        request(apiUrl + cityID + '&APPID=' + token, function (error, response, body) {
            if (!error) {

                var data = JSON.parse(body);

                //Speichert das Ergebnis der Abfrage in einem Objekt
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

                        //Temp, Min & Max - Temp wird und Celsius umgerechnet
                        temp: (data.main.temp - 273.15),
                        temp_min: (data.main.temp_min - 273.15),
                        temp_max: (data.main.temp_max - 273.15),
                        rain: data.rain['3h'],
                        clouds: data.clouds.all
                    });

                
                //Speichert die Wetterdaten in der MongoDB
                weatherData.save(function (err, weatherData) {
                    console.log("hallo");

                    if (err) return console.error(err);
                    if (!err) mongoose.connection.close();

                });





            }
            
            //Liefert die Wetterdaten zurück
            callback(weatherData);


        });

            });


        }
};
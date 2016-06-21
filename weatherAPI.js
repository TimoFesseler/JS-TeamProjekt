//Verwendete Requirements
var request = require('request');
var Weather = require('./weather_model.js');

//Anhand der cityID wird die Abfrage an die API der openWeatherMap gestellt
var cityID = '2848175';

//Token zur Autentifizierung an der openWeatherMap-Api
var token = '1ccf6bfbf52e4b3abadde9b4125547d3';

//Abfrage von aktuellen Wetterdaten eines bestimmten Ortes
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?id=';


//Variable in der sämtliche Wetterdaten einer Abfrage gespeichert werden.
var weatherData = null;


module.exports =
{

//Funktion holt die aktuellen Wetterdaten zu einem über die City ID definierten Ort und liefert
//diese anschließend zurück. Da Wetterdaten werden ebenfalls in einer MongoDB gespeichert.
    getActualWeather: function (callback) {




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



 //Liefert die Wetterdaten zurück
            callback(weatherData);

            }




        });





}};
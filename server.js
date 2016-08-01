/**
 * Created by Fabian Tschullik on 08.06.2016.
 */

/*
 ## Server-Seitig
 ++++++++   Zentrale Verteilung der Daten von Serverseitig zum Client   ++++++++
 */

var forecastAPI = require('./forecastAPI.js');
var weatherAPI = require('./weatherAPI.js');
var weatherFiveDay = require('./5DayAvgWeather.js');
var mysqlDaten = require('./mysqlDaten.js');
var currentPower = require('./currentPower.js');
var calculatePowerForecast = require('./calculatePowerForecast_desiciontree.js');

//Variablen zur Speicherung der Übergabewerte der Funktionen
var powerForecast = [];
var weatherTenDays = [];
var currentWeather = [];
var currentEnergy = [];
var powerTenResults = [];
var weatherForecast = [];


var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , conf = require('./config.json');


io.sockets.on('connection', function (socket) {

//Übertrage Daten zur Anzeige des vergangenen Wetters
        weatherFiveDay.getFiveDayWeatherData(function (result2) {
            weatherTenDays = result2;

            //Übertrage Daten zur Anzeige des aktuellen Wetters
            weatherAPI.getActualWeather(function (result3) {
                currentWeather = result3;

                //Übertrage Daten zur Anzeige des aktuellen PV-Ertrags
                currentPower.getCurrentPower(function (result4) {
                    currentEnergy = result4;

//Übertrage Daten zur Anzeige der Ertragsvorschau
                    calculatePowerForecast.calcPowerForecast(function (result1) {
                        powerForecast = result1;


                        //Übertrage Daten zur Anzeige der vergangenen PV-Leistung
                        mysqlDaten.get5DaysPVData(function (result5) {
                            for (var i = (result5.length - 10); i < (result5.length); i++) {
                                powerTenResults.push(result5[i]);
                            }


                            //Übertrage Daten zur Anzeige der vergangenen Wettervorhersagen
                            forecastAPI.get5DayForecast(function (result6) {
                                weatherForecast = result6;

                                socket.emit('powerForecastFive', powerForecast);

                                socket.emit('weatherFiveDay', weatherTenDays);

                                socket.emit('weather', currentWeather);

                                socket.emit('currentPower', currentEnergy);

                                socket.emit('powerForecast', powerTenResults);

                                socket.emit('weatherForecast', weatherForecast);




                            });
                        });
                    });
                });
            });
        });

});

// Webserver
// auf den Port x schalten
    server.listen(conf.port);

// statische Dateien ausliefern
    app.use(express.static(__dirname + '/public'));


// wenn der Pfad / aufgerufen wird
    app.get('/', function (req, res) {

        res.sendfile(__dirname + '/public/index.html');

    });


// Portnummer in die Konsole schreiben
    console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');

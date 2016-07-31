/**
 * Created by Fabian Tschullik on 08.06.2016.
 */

/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */

var forecastAPI = require('./forecastAPI.js');
var weatherAPI = require('./weatherAPI.js');
var weatherFiveDay = require('./5DayAvgWeather.js');
var mysqlDaten = require('./mysqlDaten.js');
var currentPower = require('./currentPower.js');
var calculatePowerForecast = require('./calculatePowerForecast_desiciontree.js');

var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , conf = require('./config.json');


io.sockets.on('connection', function (socket) {

    calculatePowerForecast.calcPowerForecast(function (result) {

        socket.emit('powerForecastFive', result);

    });


    weatherFiveDay.getFiveDayWeatherData(function (result) {
        
        socket.emit('weatherFiveDay', result);
        socket.emit('suntime', result);
        
    });


    //Übertrage Daten zur Anzeige des aktuellen Wetters

    weatherAPI.getActualWeather(function (result) {
        
        socket.emit('weather', result);
        
    });


    //Übertrage Daten zur Anzeige des aktuellen PV-Ertrags

    currentPower.getCurrentPower(function (result) {

        socket.emit('currentPower', result);

    });


    //Übertrage Daten zur Anzeige der vergangenen PV-Leistung
    mysqlDaten.get5DaysPVData(function (result) {
        var fiveResults = [];
        for (var i = (result.length - 10); i < (result.length); i++) {
            fiveResults.push(result[i]);
        }
        socket.emit('powerForecast', fiveResults);

    });


    //Übertrage Daten zur Anzeige der vergangenen Wettervorhersagen
    forecastAPI.get5DayForecast(function (result) {


        socket.emit('weatherForecast', result);

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

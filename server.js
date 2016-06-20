/**
 * Created by Fabian Tschullik on 08.06.2016.
 */

var forecastAPI = require('./forecastAPI.js');
var weatherAPI = require('./weatherAPI.js');
var mysqlDaten = require('./mysqlDaten.js');

var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , conf = require('./config.json');



// Websocket
        io.sockets.on('connection', function (socket) {


            //Übertrage Daten zur Anzeige des aktuellen Wetters

            weatherAPI.getActualWeather(function (result) {

           socket.emit('weather', result);

            });




            //Übertrage Daten zur Anzeige des PV-Leistung
            mysqlDaten.get5DaysPVData(function (result) {

                socket.emit('powerForecast', result);

            });

            //Übertrage Daten zur Anzeige des Wettervorhersage
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
    // so wird die Datei index.html ausgegeben
    res.sendfile(__dirname + '/public/index.html');
});


// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');


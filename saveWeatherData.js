/**
 * Created by fabiantschullik on 21.06.16.
 */

//Benötigte Requirements
var weatherAPI = require('./weatherAPI.js');
var Weather = require('./weather_model.js');
var db = require('./db.js');
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://87.106.111.229/photovoltaik');
Weather = mongoose.model('weather');
var sleep = require('sleep');
var i = 0;



while (i=0) {




//Ruft die Funktion getActualWeather auf, um die Ergebnisse in der DB zu speichern.
//Dieses Script wird durch den Server alle 3 Stunden gestartet um die Wetterdaten aufzuzeichenn.
weatherAPI.getActualWeather(function (result) {



      result.save(function (err, weatherData) {

                      if (err) return console.error(err);
                      if (!err) mongoose.connection.close();

                  });


    console.log("Neuer Datensatz wurde in der DB gespeichert:");

    //Zeigt das erhaltene Ergebnis der API-Abfrage auf der Konsole
    console.log(result);


});

setTimeout(5);

}
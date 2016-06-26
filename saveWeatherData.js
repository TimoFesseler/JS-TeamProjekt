/**
 * Created by fabiantschullik on 21.06.16.
 */

/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */


//Benötigte Requirements
var weatherAPI = require('./weatherAPI.js');
require('./weather_model');
var mongoose = require('mongoose');
var Weather = mongoose.model('Weather');







//Ruft die Funktion getActualWeather auf, um die Ergebnisse in der DB zu speichern.
//Dieses Script wird durch den Server alle 3 Stunden gestartet um die Wetterdaten aufzuzeichenn.
weatherAPI.getActualWeather(function (result) {



result.save(function (err, result) {


  if (err) return console.error(err);
  if (!err) {

  console.log("Datensatz zwurde gepspeichert: \n"+result);
  process.exit()
  }




});

});





/**
 * Created by fabiantschullik on 21.06.16.
 */

//Benötigte Requirements
var weatherAPI = require('./weatherAPI.js');


//Ruft die Funktion getActualWeather auf, um die Ergebnisse in der DB zu speichern.
//Dieses Script wird durch den Server alle 3 Stunden gestartet um die Wetterdaten aufzuzeichenn.
weatherAPI.getActualWeather(function (result) {

    console.log("Neuer Datensatz wurde in der DB gespeichert:");

    //Zeigt das erhaltene Ergebnis der API-Abfrage auf der Konsole
    console.log(result);

});

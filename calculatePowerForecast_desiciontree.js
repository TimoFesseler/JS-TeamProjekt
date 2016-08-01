/*
 ## Server-Seitig
 ++++++++   Berechnung der Ertragsvorhersage durch einen Decision Tree   ++++++++
 */


var ml = require('machine_learning');
var request = require('request');
var mysqlDaten = require('./mysqlDaten.js');
// var fiveDayAvgWeather = require('./5DayAvgWeather.js');
var forecastAPI = require('./forecastAPI.js');
var avgWeatherData = require('./avgWeatherData');


var dataPower = [];

/* Vorhersagen aus dem Decision Tree */
var powerPVData = null;

//Variablen zum Zwischenspeichern der Parametervariablen
var powerForecast = [];
var weatherArr = [];
var roundedWeek = [];


var month = new Array();
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mär";
month[3] = "Apr";
month[4] = "Mai";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dec";


module.exports =
{

    calcPowerForecast: function (callback) {


        forecastAPI.get5DayForecast(function (result) {
            var counter = 0;
            var adClouds = 0;
            var adRain = 0;
            var adTemp = 0;

            var dayX = 0;
            var dayXMin1 = 0;
            var today = new Date();


//Umwandlung des JSON-Objekt zu einem Array, damit der DecisionTree die Werte verarbeiten kann
            //Es werden Durchschnitte gebildet. Je Tag kommen 8 Werte rein, da alle drei Stunden eine Vorhersage erstellt wird,
            for (var x = 0; x < result.forecast.length; x++) {

                dayX = new Date(result.forecast[x].date_time);

                    if (x >= 1) {

                        dayXMin1 = new Date(result.forecast[x - 1].date_time);


                        if (dayX.getDay() == dayXMin1.getDay()) {
                            counter++;

                            adClouds += Number(result.forecast[x].clouds);

                            // Falls "rain" undefined ist oder, falls in "rain" nichts drin steht (leere Objekt)
                            // wird nichts gemacht, wenn etwas in dem Objekt steht wird es verwertet.
                            if (result.forecast[x].rain !== undefined) {
                                if (isNaN(result.forecast[x].rain["3h"]) == false) {

                                    adRain += result.forecast[x].rain["3h"];

                                }
                            }

                            else {

                            }

                            adTemp += result.forecast[x].temp;

                        }
                        else {
//Reihenfolge der Werte [Wolken, Regen, Temperatur]
                            if (dayXMin1.getDay() != today.getDay()) {
                                weatherArr.push(
                                    [
                                        (adClouds / counter),
                                        (adRain / counter),
                                        (adTemp / counter)
                                    ]
                                );
                            }
                            adClouds = 0;
                            adRain = 0;
                            adTemp = 0;
                            counter = 0;

                            adClouds += Number(result.forecast[x].clouds);

                            if (result.forecast[x].rain !== undefined) {
                                if (isNaN(result.forecast[x].rain["3h"]) == false) {

                                    adRain += result.forecast[x].rain["3h"];

                                }
                            }
                            adTemp += Number(result.forecast[x].temp);

                        }

                    }
                    else {
                        adClouds += Number(result.forecast[x].clouds);

                        if (result.forecast[x].rain !== undefined) {
                            if (isNaN(result.forecast[x].rain["3h"]) == false) {

                                adRain += result.forecast[x].rain["3h"];

                            }
                        }
                        adTemp += Number(result.forecast[x].temp);
                    }

                    if (x == 4) {
                        weatherArr.push(
                            [
                                (adClouds / counter),
                                (adRain / counter),
                                (adTemp / counter)
                            ]
                        );

                        adClouds = 0;
                        adRain = 0;
                        adTemp = 0;
                        counter = 0;
                    }
                }
            // }

// Wetterdaten zum lernen des DTs, werden hier übergeben
            avgWeatherData.getAvgWeatherData((function (result) {

                roundedWeek = result;


                //PV-Ertragsdaten werden hier übergeben, ebenfalls zum Lernen.
                mysqlDaten.get5DaysPVData(function (result1) {

                    /*
                     *   Decision Tree
                     *   Reference : 'Programming Collective Intelligence' by Toby Segaran.
                     */

                    /*  Arrayaufbau: [clouds, rain, temp]  */

                    var today = new Date();

                    powerPVData = result1;
                    for (var g = (powerPVData.length - roundedWeek.length); g < powerPVData.length; g++) {
                        dataPower.push(powerPVData[g].power);
                    }


                    // Hier werden dem DT die Historischen Daten übergeben
                    var dt = new ml.DecisionTree({
                        data: roundedWeek,
                        result: dataPower
                    });
                    dt.build(); // der DT wird aufgebaut
console.log(weatherArr);

                    // Da wir 5 Tage im Voraus sehen wollen, wie viel Ertrag wir möglicherweise haben werden
                    // wird hier von die 5 Felder im Array iteriert und jedes Mal eine Klassifizeirung der neuen Daten durchgeführt.
                    for (var i = 0; i < weatherArr.length; i++) {

                        var vc = dt.classify(weatherArr[i]);
                        var st = JSON.stringify(vc);

                        //Umwandlung der Ausgabe des DT, damit die Daten später im D3-Chart dargestellt werden können.
                        var convertDTOutput = parseFloat(st.match(/{(.*)}/).pop().match(/"(.*)"/).pop());
                        powerForecast.push({
                            date: (today.getDate() + i + 1) + ". " + month[today.getMonth()] + " " + today.getFullYear(),
                            power: convertDTOutput
                        });

                    }

                    callback(powerForecast);

                    powerForecast = [];
                    weatherArr = [];

                });

            }))

        });

    }
};
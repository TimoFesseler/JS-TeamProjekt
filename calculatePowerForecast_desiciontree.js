/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */


var ml = require('machine_learning');
var request = require('request');
var mysqlDaten = require('./mysqlDaten.js');
var fiveDayAvgWeather = require('./5DayAvgWeather.js');

var dataPower = [];
var dataDate = [];
var powerForecast = [];
/* Vorhersagen aus dem Decision Tree */
var powerPVData = null;
/* Speichern der Power-Daten des Arrays aus mysqlDaten.js --> daysJSON.js */
var weatherData = null;

module.exports =
{

    calcPowerForecast: function (callback) {

// function weather() {
//
//
//     fiveDayAvgWeather.getFiveDayWeatherData(function (result) {
//         weatherData = result;
//         // console.log(weatherData);
//     });
//
//
// }
// weather();

        var weatherTestArr = [
            [10, 0.5, 26.5],
            [6, 0.0, 28.7],
            [58, 3.8, 23.8],
            [100, 10.0, 18.0],
            [1, 0.1, 30.3]
        ];


        mysqlDaten.get5DaysPVData(function (result1) {
            
            /* 
             *   Decision Tree
             *   Reference : 'Programming Collective Intelligence' by Toby Segaran.
             */

            /*  Arrayaufbau: [clouds, rain, temp]  */
            var data = [
                [88, 0.5, 23.6],
                [20, 0.5, 13.6],
                [1, 0.0, 23.8],
                [76, 9.5, 21.6],
                [45, 5.5, 18.4],
                [2, 0.0, 32.2],
                [5, 0.5, 29.6]
            ];


            powerPVData = result1;
            for (var g = (powerPVData.length - data.length); g < powerPVData.length; g++) {
                dataPower.push(powerPVData[g].power);
                dataDate.push(powerPVData[g].date);
            }

            var result = dataPower;

            var dt = new ml.DecisionTree({
                data: data,
                result: result
            });

            //console.log("Classify : ", dt.classify([50, 0, 24.7]));
            
            for (var i = 0; i < weatherTestArr.length; i++) {

                dt.build();
                dt.prune(1.0); // 1.0 : mingain.
                // dt.print();  // Ausgabe des Decision Trees
                var convertDTInput = "[" + weatherTestArr[i] + "]";

                var vc = dt.classify(convertDTInput);
                var st = JSON.stringify(vc);
                var convertDTOutput = st.match(/{(.*)}/).pop().match(/"(.*)"/).pop();

                powerForecast.push({
                    date: dataDate[i],
                    power: convertDTOutput
                });
            }
            callback(powerForecast);
            
        });
    }
};
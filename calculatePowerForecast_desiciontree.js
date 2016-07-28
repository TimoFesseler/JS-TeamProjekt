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
        var powerForecast = [];
        var weatherTestArr = [
            [100, 9.5, 20],
            [50, 0.5, 20],
            [0, 0, 20],
            [70, 5.5, 20],
            [1, 0.1, 30.3]
        ];


        mysqlDaten.get5DaysPVData(function (result1) {

            /* 
             *   Decision Tree
             *   Reference : 'Programming Collective Intelligence' by Toby Segaran.
             */

            /*  Arrayaufbau: [clouds, rain, temp]  */
            var data = [
                [1, 9.5, 20],
                [20, 0.5, 20],
                [50, 0.5, 20],
                [10, 5.5, 20],
                [80, 5.5, 20],
                [90, 0.0, 20],
                [0, 0, 20]
            ];

            powerPVData = result1;
            for (var g = (powerPVData.length - data.length); g < powerPVData.length; g++) {
                dataPower.push(powerPVData[g].power);
                dataDate.push(powerPVData[g].date);
            }
            console.log("Was steht in 'powerPVData'?")
            console.log(powerPVData);
            var result = dataPower;
            var dt = new ml.DecisionTree({
                data: data,
                result: result
            });
            dt.build();

            for (var i = 0; i < weatherTestArr.length; i++) {
                // dt.prune(1.0); // 1.0 : mingain.

                var vc = dt.classify(weatherTestArr[i]);
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
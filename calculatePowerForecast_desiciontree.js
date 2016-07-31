/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */


var ml = require('machine_learning');
var request = require('request');
var mysqlDaten = require('./mysqlDaten.js');
// var fiveDayAvgWeather = require('./5DayAvgWeather.js');
var forecastAPI = require('./forecastAPI.js');
var avgWeatherData = require('./avgWeatherData');


var dataPower = [];
var dataDate = [];
/* Vorhersagen aus dem Decision Tree */
var powerPVData = null;

var powerForecast = [];
var weatherRawArr = [];
var weatherArr = [];
var roundedWeek = [];


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


            for (var x = 0; x < result.forecast.length; x++) {
                console.log(adRain);
                dayX = new Date(result.forecast[x].date_time);
                console.log("====================");
console.log(dayX);
                if (x >= 1) {

                    dayXMin1 = new Date(result.forecast[x - 1].date_time);
                    console.log(dayXMin1);
                    if (Number(dayX.getDay()) == Number(dayXMin1.getDay())) {
                        counter++;
                        console.log(dayX.getDay() == dayXMin1.getDay());
                        console.log("DayX: " + dayX.getDay());
                        console.log("DayXMin1: " + dayXMin1.getDay());
                        adClouds += Number(result.forecast[x].clouds);

                        if (result.forecast[x].rain != null) {

                            adRain += result.forecast[x].rain["3h"];

                        }
                        adTemp += Number(result.forecast[x].temp);

                    }
                    else {
                        console.log("drin");

                        weatherArr.push[
                            (adClouds / counter),
                                (adRain / counter),
                                (adTemp / counter)
                            ];

                        adClouds = 0;
                        adRain = 0;
                        adTemp = 0;
                        counter = 0;

                        adClouds += Number(result.forecast[x].clouds);

                        if (result.forecast[x].rain != null) {

                            adRain += result.forecast[x].rain["3h"];
                        }
                        adTemp += Number(result.forecast[x].temp);

                    }

                }
                else {
                    adClouds += Number(result.forecast[x].clouds);

                    if (result.forecast[x].rain != null) {

                        adRain += result.forecast[x].rain["3h"];

                    }
                    adTemp += Number(result.forecast[x].temp);
                }
            }

            console.log("==============????============");
            console.log(weatherArr.length);
            // console.log(weatherArr);

            avgWeatherData.getAvgWeatherData((function (result) {

                roundedWeek = result;

                mysqlDaten.get5DaysPVData(function (result1) {

                    /*
                     *   Decision Tree
                     *   Reference : 'Programming Collective Intelligence' by Toby Segaran.
                     */

                    /*  Arrayaufbau: [clouds, rain, temp]  */


                    powerPVData = result1;
                    for (var g = (powerPVData.length - roundedWeek.length); g < powerPVData.length; g++) {
                        dataPower.push(powerPVData[g].power);
                        dataDate.push(powerPVData[g].date);
                    }

                    var dt = new ml.DecisionTree({
                        data: roundedWeek,
                        result: dataPower
                    });
                    dt.build();

                    for (var i = 0; i < weatherRawArr.length; i++) {
                        // dt.prune(1.0); // 1.0 : mingain.

                        var vc = dt.classify(weatherRawArr[i]);
                        var st = JSON.stringify(vc);
                        var convertDTOutput = st.match(/{(.*)}/).pop().match(/"(.*)"/).pop();
                        powerForecast.push({
                            date: dataDate[i],
                            power: convertDTOutput
                        });

                    }
                    callback(powerForecast);

                });

            }))

        });

    }
};
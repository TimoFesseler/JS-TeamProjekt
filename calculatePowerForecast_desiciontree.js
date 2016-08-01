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


            for (var x = 0; x < result.forecast.length; x++) {

                dayX = new Date(result.forecast[x].date_time);


                if (x >= 1) {

                    dayXMin1 = new Date(result.forecast[x - 1].date_time);



                    if (dayX.getDay() == dayXMin1.getDay()) {
                        counter++;

                        adClouds += Number(result.forecast[x].clouds);


                        if (isNaN(result.forecast[x].rain["3h"]) == false) {

                            adRain += result.forecast[x].rain["3h"];

                        }


                        else {

                        }

                        adTemp += result.forecast[x].temp;

                    }
                    else {

                        weatherArr.push(
                            [
                                (adClouds/counter),
                                (adRain / counter),
                                (adTemp/counter)
                            ]
                        );

                        adClouds = 0;
                        adRain = 0;
                        adTemp = 0;
                        counter = 0;

                        adClouds += Number(result.forecast[x].clouds);

                        if (isNaN(result.forecast[x].rain["3h"]) == false) {

                            adRain += result.forecast[x].rain["3h"];
                        }
                        adTemp += Number(result.forecast[x].temp);

                    }

                }
                else {
                    adClouds += Number(result.forecast[x].clouds);

                    if (isNaN(result.forecast[x].rain["3h"]) == false) {

                        adRain += result.forecast[x].rain["3h"];

                    }
                    adTemp += Number(result.forecast[x].temp);
                }

                if(x==4){
                    weatherArr.push(
                        [
                            (adClouds/counter),
                            (adRain / counter),
                            (adTemp/counter)
                        ]
                    );

                    adClouds = 0;
                    adRain = 0;
                    adTemp = 0;
                    counter = 0;
                }
            }



            avgWeatherData.getAvgWeatherData((function (result) {

                roundedWeek = result;

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

                    var dt = new ml.DecisionTree({
                        data: roundedWeek,
                        result: dataPower
                    });
                    dt.build();

                    for (var i = 0; i < weatherArr.length; i++) {
                        // dt.prune(1.0); // 1.0 : mingain.

                        var vc = dt.classify(weatherArr[i]);
                        var st = JSON.stringify(vc);
                        var convertDTOutput = parseFloat(st.match(/{(.*)}/).pop().match(/"(.*)"/).pop());
                        powerForecast.push({
                            date: (today.getDate()+i+1) + ". " + month[today.getMonth()] + " " + today.getFullYear(),
                            power: convertDTOutput
                        });

                    }

                    callback(powerForecast);

                    powerForecast=[];
                    weatherArr=[];

                });

            }))

        });

    }
};
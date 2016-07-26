/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */


var brain = require('brain');
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

// module.exports =
// {
//
//     calcPowerForecast: function (callback) {

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
// console.log(result[0]);
            var net = new brain.NeuralNetwork();

            // net.train([
            //     {input: data[0], output: result[0]},
            //     {input: data[1], output: result[1]},
            //     {input: data[2], output: result[2]},
            //     {input: data[3], output: result[3]},
            //     {input: data[4], output: result[4]},
            //     {input: data[5], output: result[5]},
            //     {input: data[6], output: result[6]}]);

            
// clouds = c, rain = r, temprature = t

                net.train([{input: {c: 88, r: 0.5, t: 23.6}, output: {power: 10}},
                    {input: {c: 1, r: 0.5, t: 25}, output: {power: 90}},
                    {input: {c: 45, r: 6.5, t: 18.4}, output: {power: 60}}]);

                var output = net.run([2, 0.0, 32.2]);

                // var output = net.run(data1[0]);  // { white: 0.99, black: 0.002 }
            // for (var i = 0; i < weatherTestArr.length; i++) {
            //
            //
            //     // var convertDTInput = "[" + weatherTestArr[i] + "]";
            //
            //     var output = net.run([10, 0.5, 26.5]);
                // var st = JSON.stringify(output);
                // var convertDTOutput = st.match(/{(.*)}/).pop().match(/"(.*)"/).pop();
console.log(output);

                // powerForecast.push({
                //     date: dataDate[i],
                //     power: st[i]
                // });
            // }
            // callback(powerForecast);
// console.log("Power Forecast: " + powerForecast);
        }
        );
    // }
// }

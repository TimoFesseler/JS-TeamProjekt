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


var dataPower = [];
var dataDate = [];
/* Vorhersagen aus dem Decision Tree */
var powerPVData = null;
/* Speichern der Power-Daten des Arrays aus mysqlDaten.js --> daysJSON.js */
var weatherData = null;

//Verbindung Herstellen zur Mongo DB
var mongoose = require('mongoose');

var powerForecast = [];
var weatherTestArr = [];


forecastAPI.get5DayForecast(function (result) {
    weatherTestArr = result;
    console.log("==============????============");
    console.log(weatherTestArr);
});

module.exports =
{

    calcPowerForecast: function (callback) {





        require('./weather_model');
        var Weather = mongoose.model('Weather');

        var date1 = new Date();
        date1.setDate(date1.getDate() - 1);
        var date2 = new Date();
        var dateFirst = 0;
        var dateNext = 0;

        date2.setDate(Weather.findById({_id: "5769173f0f9095197edb0504"}, function (err, user) {
            if (err) {
                console.log("Something WRONG: ", err);
            }
            else {
                return user.date_time;
            }
        }));

        var oneDay = [];
        var week = [];
        var roundedCloudsCounter = 0;
        var roundedRainCounter = 0;
        var roundedTempCounter = 0;
        var roundedSuntimeCounter = 0;
        var roundedDay;
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

        var roundedWeek = [];

        Weather.find({"date_time": {$gt: date2, $lt: date1}}, function (err, docs) {
            dateFirst = docs[0].date_time.getDate();

            for (var i = 0; i < docs.length; i++) {
                dateNext = docs[i].date_time.getDate();

                if (dateFirst == dateNext) {
                    oneDay.push(docs[i]);
                }
                else {
                    week.push(oneDay);
                    oneDay = [];
                    oneDay.push(docs[i]);
                }

                dateFirst = dateNext;
            }
            week.push(oneDay);


// round the clouds

            for (var h = 0; h < week.length; h++) {
                for (var y = 0; y < week[h].length; y++) {
                    roundedCloudsCounter = roundedCloudsCounter + week[h][y].clouds;

                    roundedSuntimeCounter = (roundedSuntimeCounter + week[h][y].sunset) - roundedSuntimeCounter + week[h][y].sunrise;

                    var rainValue = Number(week[h][y].rain);
                    if (isNaN(week[h][y].rain)) {
                        rainValue = 0
                    }
                    roundedRainCounter = roundedRainCounter + rainValue;

                    roundedTempCounter = roundedTempCounter + week[h][y].temp;
                }

                roundedDay = [
                    (roundedCloudsCounter / week[h].length),
                    (roundedSuntimeCounter / week[h].length),
                    (roundedRainCounter / week[h].length),
                    (roundedTempCounter / week[h].length)
                    // (week[h][0].date_time.getDate() + ". " + month[week[h][0].date_time.getMonth()] + " " + week[h][0].date_time.getFullYear())
                ];

                roundedWeek.push(roundedDay);

                roundedDay = null;
                roundedCloudsCounter = 0;
                roundedSuntimeCounter = 0;
                roundedRainCounter = 0;
                roundedTempCounter = 0;

            }


            // roundedWeek = [];
            roundedDay = [];
        });


        // var weatherTestArr = [
        //     [100, 9.5, 20],
        //     [50, 0.5, 20],
        //     [0, 0, 20],
        //     [70, 5.5, 20],
        //     [1, 0.1, 30.3]
        // ];


        mysqlDaten.get5DaysPVData(function (result1) {

            /* 
             *   Decision Tree
             *   Reference : 'Programming Collective Intelligence' by Toby Segaran.
             */

            /*  Arrayaufbau: [clouds, rain, temp]  */

            var data = roundedWeek;
console.log("was steht in 'data'?");
            console.log(data);
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
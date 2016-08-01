/*
 ## Server-Seitig
 ++++++++   Abfrage der MongoDB   ++++++++
 ++++++++   Aufbereitung der gespeicherten Wetterdaten   ++++++++
 */


var mongoose = require('mongoose');
var request = require('request');
require('./weather_model');
var Weather = mongoose.model('Weather');


module.exports =
{

    getAvgWeatherData: function (callback) {

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

                    var rainValue = Number(week[h][y].rain);
                    if (isNaN(week[h][y].rain)) {
                        rainValue = 0
                    }
                    roundedRainCounter = roundedRainCounter + rainValue;

                    roundedTempCounter = roundedTempCounter + week[h][y].temp;
                }

                roundedDay = [
                    (roundedCloudsCounter / week[h].length),
                    (roundedRainCounter / week[h].length),
                    (roundedTempCounter / week[h].length)
                    // (week[h][0].date_time.getDate() + ". " + month[week[h][0].date_time.getMonth()] + " " + week[h][0].date_time.getFullYear())
                ];

                roundedWeek.push(roundedDay);


                roundedDay = null;
                roundedCloudsCounter = 0;
                roundedRainCounter = 0;
                roundedTempCounter = 0;

            }
            callback(roundedWeek);

            // roundedWeek = [];
            // roundedDay = [];
        });


    }};
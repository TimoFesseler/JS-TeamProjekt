/**
 * Created by Fabian Tschullik on 18.06.2016.
 */


var mongoose = require('mongoose');
var request = require('request');
require('./weather_model');
var Weather = mongoose.model('Weather');
var date1 = new Date();
var date2 = new Date();
var dateFirst = 0;
var dateNext = 0;
date2.setDate(date2.getDate() -5);
var oneDay = [];
var week = [];
var dayCount = 0;
var g = 0;
var p;
var roundedClouds;
var roundedCloudsCounter = 0;
var roundedDay;
var teiler = 0;

var roundedWeek = [];


module.exports =
{

getFiveDayWeatherData: function (callback) {


Weather.find({ "date_time": { $gt: date2, $lt: date1 }}, function (err, docs) {

var dateFirst = docs[0].date_time.getDate();


        for(var i = 0; i<docs.length; i++) {

        dateNext = docs[i].date_time.getDate();




        if (dateFirst == dateNext){

        oneDay.push(docs[i]);



        }


        else {

        week.push(oneDay);
        oneDay = [];
        oneDay.push(docs[i]);



        }


        dateFirst = dateNext;


        };
console.log(week.length);
week.push(oneDay);

console.log(week.length);
console.log(week.length);
console.log(week.length);
console.log(week.length);


// round the clouds


for (var h = 0; h<week.length; h++){


for (var y = 0; y<week[h].length; y++){

roundedCloudsCounter = roundedCloudsCounter+week[h][y].clouds;

console.log("Counter"+roundedCloudsCounter);

}

roundedDay = {clouds: (roundedCloudsCounter/week[h].length), date_time: (week[h][0].date_time) };


roundedWeek.push(roundedDay);
console.log("PUSHED");

roundedDay = null;
roundedCloudsCounter =0;


}



console.log(roundedWeek);
callback(roundedWeek);






        });

}
}


/**
 * Created by Fabian Tschullik on 18.06.2016.
 */
/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
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
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

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

week.push(oneDay);




// round the clouds


for (var h = 0; h<week.length; h++){


for (var y = 0; y<week[h].length; y++){

roundedCloudsCounter = roundedCloudsCounter+week[h][y].clouds;

console.log("Counter"+roundedCloudsCounter);

}

roundedDay = {clouds: (roundedCloudsCounter/week[h].length), date_time: (week[h][0].date_time.getDate()+". "+month[week[h][0].date_time.getMonth()]+" "+week[h][0].date_time.getFullYear()) };


roundedWeek.push(roundedDay);
console.log("PUSHED");

roundedDay = null;
roundedCloudsCounter =0;


}



console.log(roundedWeek);
callback(roundedWeek);

roundedWeek = [];
roundedDay = [];






        });

}
}


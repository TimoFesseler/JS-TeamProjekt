/**
 * Created by Fabian Tschullik on 18.06.2016.
 */



var ml = require('machine_learning');
var request = require('request');
var mysqlDaten = require('./mysqlDaten.js');
var FiveDayAvgWeather = require('./5DayAvgWeather.js');

var data2 = [];

// [power]
mysqlDaten.get5DaysPVData(function(result){
    for (var g = 0; g < result.length; g++){
        data2.push(result[g].power);
    }
    console.log(data2);

FiveDayAvgWeather.get5DaysWeather

// Decision Tree
// Reference : 'Programming Collective Intellignece' by Toby Segaran.

// [clouds, rain, temp]


    var data =[[88, 0.5, 23.6],
        [20, 0.5, 13.6],
        [1, 0.0, 23.8],
        [76, 9.5, 21.6],
        [45, 5.5, 18.4]];

    var result= data2;




    var dt = new ml.DecisionTree({
        data : data,
        result : result
    });

    dt.build();
// console.log("Start");
    dt.print();

    console.log("Classify : ", dt.classify([50, 0, 24.7]));

    dt.prune(1.0); // 1.0 : mingain.
    dt.print();











});



//Hole PV-Daten Durchschnitt der letzten 5 Tage





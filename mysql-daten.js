var mysql = require('mysql');
var loginFile = require('./SBFspot-user.json');

var logServer = loginFile.server;
var logData = loginFile.database;
var logUser = loginFile.user;
var logPsw = loginFile.psw;

// First you need to create a connection to the db
var connectionMySQL = mysql.createConnection({
    host: logServer,
    user: logUser,
    password: logPsw,
    database: logData
});

connectionMySQL.connect(function(err){
    if(err){
        console.log('Error connecting to Db' + err );
        return;
    }
    console.log('Connection established');
});


var dayPower ={};
console.log(dayPower.power);

connectionMySQL.query('SELECT * FROM DayData WHERE TimeStamp > 1462077900 ORDER BY TimeStamp', function(err, rows, fields) {
    if (err) throw err;

    var dayData = [];
    var weekData = [];
    var weeksData = [];
    var startTime = 1462060800;
    console.log(rows.length + " Zeilen");
    for (i = 0; i < rows.length; i++) {
        var datum = timeConverter(rows[i].TimeStamp);

        // folgender Code stammt von http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
        var power = rows[i].Power;

        var timeData = { datum: datum, power: power };

        if (startTime + (60*60*24) > rows[i].TimeStamp) {
            // Alle Einträge eines Tages in dayData
            dayData.push(timeData);
        } else {
            // Nach einem Tag

            weekData.push(dayData)
            dayData = [];
            dayData.push(timeData);
            startTime = startTime + (60*60*24);

            if (weekData.length > 4) {
                weeksData.push(weekData);
                weekData = [];

            }
        }



    }
    for (var k = 0; k < weeksData.length; k++) {
        var testWeekData = weeksData[k];

        for (var j = 0; j < testWeekData.length; j++) {
            var testDayData = testWeekData[j];
            for (var x = 0; x < testDayData.length; x++) {
                var testTimeData = testDayData[x];


                console.log("Zeile " + zero2i() + ": " + k + " - " + j + " - " + x + " - " + testTimeData.datum + " --- KW ---> " + testTimeData.power);
            }
        }
    }
})
//78115598233698317051

connectionMySQL.end(function(err) {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
});

function timeConverter(datum) {

    var dat = new Date(datum * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = dat.getFullYear();
    var month = months[dat.getMonth()];

    // Anpassung: Führende 0 bei Tag, Stunden & Minuten <10 anfügen
    //eigender Code
    function date() {
        if (dat.getDate() < 10) {
            return ("0" + dat.getDate());
        }
        else {
            return dat.getDate()
        }
    }

    function hour() {
        if (dat.getHours() < 10) {
            return ("0" + dat.getHours());
        }
        else {
            return dat.getHours()
        }
    }

    function min() {
        if (dat.getMinutes() < 10) {
            return ("0" + dat.getMinutes());
        }
        else {
            return dat.getMinutes()
        }
    }

    var time = date() + ' ' + month + ' ' + year + ' ' + hour() + ':' + min();
    return time;
}

function zero2i() {
    if (i < 10) {
        return "0" + i;
    }
    else {
        return i;
    }
}
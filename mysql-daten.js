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

connectionMySQL.query('SELECT * FROM DayData', function(err, rows, fields){
    if(err) throw err;
for (i=0; i< rows.length;i++) {
    datum = rows[i].TimeStamp;
    function timeConverter(datum){
        datum = this.datum;
        dat = new Date(datum*1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = dat.getFullYear();
        var month = months[dat.getMonth()];


        // Führende 0 bei Tag, Stunden & Minuten <10 anfügen
        function date(){
            if (dat.getDate()<10){
                return ("0" + dat.getDate());
            }
            else
            {return dat.getDate()}
        }

        function hour(){
            if (dat.getHours()<10){
                return ("0" + dat.getHours());
            }
            else
            {return dat.getHours()}
        }

        function min(){
            if (dat.getMinutes()<10){
               return ("0" + dat.getMinutes());
            }
            else
            {return dat.getMinutes()}
        }
        var time = date() + ' ' + month + ' ' + year + ' ' + hour() + ':' + min() ;
        return time;
    }


    power = rows[i].Power;
    function zero2i (){
        if (i<10){
            return "0"+i;
        }
        else
        {
            return i;
        }
    }
    
    console.log("Zeile " + zero2i() + ": " + timeConverter() + " --- KW ---> " + power);
}
});



connectionMySQL.end(function(err) {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
});
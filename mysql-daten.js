var mysql = require('mysql');
var fs = require('fs');
var loginFile = 'SBFspot-user.json';

fs.readFile(loginFile, 'utf-8', function (err, data){
 if(err){
     console.log('Error: ' + err);
     return;
 }
    //Auslesen der JSON-Datei um Logindaten nicht auf GIT preiszugeben
    data = JSON.parse(data);
    var logServer = data.server;
    var logData = data.database;
    var logUser = data.user;
    var logPsw = data.psw;


// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "www.schrolm.de",
    user: logUser,
    password: logPsw,
    database: "SBFspot"
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to Db' + err );
        return;
    }
    console.log('Connection established');
});

con.query('SELECT * FROM DayData', function(err, rows, fields){
    if(err) throw err;

    console.log(rows[0].Serial);
});



con.end(function(err) {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
});
});
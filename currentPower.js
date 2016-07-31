/*
 ## Server-Seitig
 ++++++++   Datenbankverbindung (MySQL) zu den PV-Daten   ++++++++
 ++++++++   Verarbeitung der Daten zum Anzeigen in Diagrammen und Verwendung der Ertragsvorhersage   ++++++++
 */


var mysql = require('mysql');
var loginFile = require('./SBFspot-user.json');
var request = require('request');
var currentPower = [];


module.exports =
{

    getCurrentPower: function (callback) {


//Variablen für die MySQL-Verbindungdaten aus der JSON Datei.
// Man soll auf GIT-Hub keine Login-Daten aus dem Code lesen können
        var logServer = loginFile.server;
        var logData = loginFile.database;
        var logUser = loginFile.user;
        var logPsw = loginFile.psw;

// Erstellung einer Verbindung
        var connectionMySQL = mysql.createConnection({
            host: logServer,
            user: logUser,
            password: logPsw,
            database: logData
        });

// Herstellung einer Verbindung mit Ausgabe in der Konsole, ob Verbindung hergestellt oder nicht
        connectionMySQL.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db' + err);
                return;
            }
            console.log('Connection established');
        });


// Ausführung der SQL-Abfrage mit Verarbeitung der Daten
// Letzten Eintrag abrufen
        connectionMySQL.query('SELECT * FROM DayData ORDER BY TimeStamp DESC LIMIT 1', function (err, rows, fields) {
            if (err) throw err;

            // Speichern der kWh-Anzahl, je ausgelesener Zeile aus der DB
            var currentPower = (rows[0].Power / 1000);

            // Objekterzeugnung und schreiben in das daysJSON-Array


            callback(currentPower);

        });


// Verbindung wird hier beendet
        connectionMySQL.end(function (err) {
        });
    }
};

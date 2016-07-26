/*
 ## Server-Seitig
 ++++++++   Datenbankverbindung (MySQL) zu den PV-Daten   ++++++++
 ++++++++   Verarbeitung der Daten zum Anzeigen in Diagrammen und Verwendung der Ertragsvorhersage   ++++++++
 */


var mysql = require('mysql');
var loginFile = require('./SBFspot-user.json');
var request = require('request');
var daysJSON = [];


module.exports =
{

    get5DaysPVData: function (callback) {


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
// Startzeit (siehe SQL-Statement), da wir erst die Daten ab dem 1. Mai 2016 abfangen
        connectionMySQL.query('SELECT * FROM MonthData WHERE TimeStamp > 1462060800 ORDER BY TimeStamp', function (err, rows, fields) {
            if (err) throw err;

            for (var i = 0; i < rows.length; i++) {
                // Speichern des konvertierten Datums, je ausgelesener Zeile aus der DB
                var datum = rows[i].TimeStamp;
                // Speichern der kWh-Anzahl, je ausgelesener Zeile aus der DB
                var power = (rows[i].DayYield/1000);

                var showDate = timeConverter(datum);
                // Objekterzeugnung und schreiben in das daysJSON-Array
                daysJSON.push({
                    date: showDate,
                    power: power
                });
            }
// console.log(daysJSON);
            callback(daysJSON);

        });


// Verbindung wird hier beendet
        connectionMySQL.end(function (err) {
        });


// folgender Code stammt von http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
        function timeConverter(datum) {
            // Das Datum wird in die DB als UNIX-Timestamp geschrieben.
            // Um das richtige Datum als auch Uhrzeit bekommen zu können muss man
            // den UNIX-Timestamp, welcher in Sekunden ist *1000 nehmen,
            // damit die "new Date()"-Funktion den Timnestamp richtig übersetzt.
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

            // var zeit = date() + ' ' + month + ' ' + year + ' ' + hour() + ':' + min();
            var zeit = date() + ' ' + month + ' ' + year;
            return zeit;


        }
    }
};


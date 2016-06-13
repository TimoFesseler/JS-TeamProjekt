var mysql = require('mysql');
var loginFile = require('./SBFspot-user.json');
// var io = require('socket.io').listen(server);

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
connectionMySQL.query('SELECT * FROM DayData WHERE TimeStamp > 1462060800 ORDER BY TimeStamp', function (err, rows, fields) {
    if (err) throw err;

    // Array für die kurzfristige Speicherung der PV-Daten aus der MySQL-DB
    var dayData = [];
    var weekData = [];
    var weeksData = [];

    // Variablen zum Speichern von Durchschnittswerten der Tage, geordnet in 5er-Wochen
    var averageDays = [];
    var weeksAverageDays = [];
    var avgPower = null;

    // Variable zum Addieren der Energie (KW)
    var countPower = 0;
    // Variable zum Zählen der Einträge des Arrays
    var entriesCountPower = 0;

    //Variable als Counter für die Arrays.
    var startTime = 1462060800;
    for (var i = 0; i < rows.length; i++) {
        // Speichern des konvertierten Datums, je ausgelesener Zeile aus der DB
        var datum = rows[i].TimeStamp;
        // Speichern der KW-Anzahl, je ausgelesener Zeile aus der DB
        var power = rows[i].Power;
        // Schreiben des Datums & Energy in ein Array, je ausgelesener Zeile aus der DB
        var rowData = {datum: datum, power: power};

        // Anweisung um die Daten Tagesweise in ein Array schreiben zu können.
        // Gezählt wird in Sekunden, da UNIX-Timestamp in der DB hinterlegt ist.
        // Wenn der nächste Tag erreicht ist (24h in Sek) wird ein neues Array erstellt und das "volle" Array in das "Wochen"-Array geschrieben.
        if (startTime + (60 * 60 * 24) > rows[i].TimeStamp) {

            // Alle Einträge eines Tages werden in das Array "dayData" geschrieben
            dayData.push(rowData);


        } else {
            weekData.push(dayData);
            dayData = [];
            dayData.push(rowData);
            startTime = startTime + (60 * 60 * 24);


            // Sobald 5 Tage in dem Wochen-Array stehen, wird ein neues Wochenarray erstellt.
            if (weekData.length > 4) {
                weeksData.push(weekData);
                weekData = [];

                /*
                 * 5 Tage je Woche, da die API der Wettervorhersage von OpenWeatherMap uns diese Anzahl ausgibt.
                 */
            }
        }
    }

    // // Zählervariable für die Zeilen in der Konsolenausgabe
    // var countZeile = 0;
    //
    // // Ausgabe der Arrays um zu sehen, ob die Daten auch richtig gesichert werden
    // for (var k = 0; k < weeksData.length; k++) {
    //     var testWeekData = weeksData[k];
    //     for (var j = 0; j < testWeekData.length; j++) {
    //         var testDayData = testWeekData[j];
    //
    //         for (var x = 0; x < testDayData.length; x++) {
    //             var testTimeData = testDayData[x];
    //
    //             countZeile++;
    //
    //             // console.log("Zeile " + countZeile + ": " + k + " - " + j + " - " + x + " - " + testTimeData.datum + " --- KW ---> " + testTimeData.power);
    //         }
    //     }
    // }

 //Durschnitt berechen und Objekt aufbereiten für Darstellung in GUI

     var avgWeeksData = weeksData[weeksData.length-1];
    console.log(avgWeeksData);
        for(var d = 0; d < avgWeeksData.length; d++) {
            var dAvgWeekData = avgWeeksData[d];
            compDatum = new Date(dAvgWeekData[0].datum*1000);
            for (var e = 0; e < dAvgWeekData.length; e++) {
    var dDayData = dAvgWeekData[e];
               dDatum = new Date(dDayData.datum*1000);

                var dayNow = dDayData[0].getDate();
                if(dayNow == ddatum)
                console.log(dDatum.getDate());
            }
        }


    3#7_Bc-9N7w








});


















// Verbindung wird hier beendet
connectionMySQL.end(function (err) {});

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

    var zeit = date() + ' ' + month + ' ' + year + ' ' + hour() + ':' + min();
    return zeit;
}


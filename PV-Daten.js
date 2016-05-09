/* Funktioniert! Creds: http://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js Name: kofrasa */
// var fs = require('fs'),
//     readline = require('readline');
//
// var rd = readline.createInterface({
//     input: fs.createReadStream('../TeamProjekt/PV-Daten/Fesseler-201601.csv'),
//     output: process.stdout,
//     terminal: false
// });
//
// rd.on('line', function(line) {
//     console.log(line);
// });


var fs = require('fs');
var mongoose = require('mongoose');

fs.readFile('../TeamProjekt/PV-Daten/Fesseler-201601.csv', 'utf-8', function (err, inhalt){
    if (err){
        return console.log(err);
    }

    var lines = inhalt.split(/\r?\n/);
    var result = new Array();

    for (var i = 9; i < lines.length-1; i++) {
        // if(i > 8 ) {
            var line = lines[i];
            // console.log("# das ist das Attribut 'line': " + line);
            var tokens = line.split(/;/);
            // console.log("# das ist das Attribut 'tokens': " + tokens);
            // console.log("# das ist das Attribut 'datum': " + tokens[0]);
            // console.log("# das ist das Attribut 'kWhTilToday': " + tokens[1]);
            // console.log("# das ist das Attribut 'kWhMom': " + tokens[2] + "\n");

            // if (tokens.length != 5) {
            //     error("Komische Zeile (" + (i + 1) + "): " + line);
            // }
            var daten = {
                datum: tokens[0],
                kWhTilToday: tokens[1],
                kWhMom: tokens[2]
            };
        // }
        result.push(daten);
    }
    console.log(result);
    // output(JSON.stringify(result, null, 2));
});

var db = mongoose.connection;
mongoose.connect(url);
var url = 'mongodb://localhost/PV';

db.on('error', console.error);
db.once('open', function() {
    var pvDatenSchema = new mongoose.Schema({
        datum: {type: date},
        kWhTilToday: Number,
        kWhMom: Number
    });
    var PV = mongoose.model('PV', pvDatenSchema);

    var pvDaten = new PV({
        datum: tokens[0],
        kWhTilToday: tokens[1],
        kWhMom: tokens[2]
    });

    pvDaten.save(function (err, pvDaten) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
            // return console.error(err);
            // console.dir(pvDaten);
        }

    });
});


// var lines = inhalt.split(/\r?\n/);
// var result = new Array();
// // for (var i = 0; i < lines.length; i++) {
// for (var i = 0; i < 1000; i++) {
//     if (i == 0) continue;
//     var line = lines[i];
//     var tokens = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
//     if (tokens.length != 5) {
//         error("Komische Zeile (" + (i + 1) + "): " + line);
//     }
//     else {
//         var ppn = tokens[0];
//         while (ppn.length < 9) {
//             ppn = "0" + ppn;
//         }
//         // "0".repeat(9-ppn.length) + ppn;
//
//         var exemplar = {
//             ppn: ppn,
//             exemplarNr: tokens[1],
//             signatur: tokens[2],
//             barcode: tokens[3],
//             sigel: tokens[4]
//         };
//     }
//     result.push(exemplar);
// }
// output(JSON.stringify(result, null, 2));
// });

// var reader = csv.createCsvFileReader('../TeamProjekt/PV-Daten/Fesseler-201601.csv', {
//     columnsFromHeader: true
// });
// var writer = new csv.CsvWriter(process.stdout);
// reader.addListener('data', function(data){
//     writer.writeRecord(data);
// });


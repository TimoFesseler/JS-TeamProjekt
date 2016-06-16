var fs = require('fs');
var date = require('date-and-time');
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/PV';
mongoose.connect(url);


var pvDatenSchema = new mongoose.Schema({
    datum: Date,
    kWhTilToday: Number,
    kWhMom: Number
});
var PV = mongoose.model('PV', pvDatenSchema);

fs.readFile('../TeamProjekt/PV-Daten/Fesseler-201601.csv', 'utf-8', function (err, inhalt) {
    if (err) {
        return console.log(err);
    }

    var lines = inhalt.split(/\r?\n/);

    for (var i = 9; i < lines.length - 1; i++) {
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
        date.locale('de');
        var dateFromLine = date.parse(tokens[0], 'DD/MM/YYYY');
        console.log(new Date(date.format(dateFromLine, "YYYY-MM-DD")));
        var kWhTilToday = tokens[1].replace(",", ".");
        console.log(kWhTilToday);
        var kWhMom = tokens[2].replace(",", ".");
        console.log(kWhMom);
        var pvDaten = new PV({
            datum: new Date(date.format(dateFromLine, "YYYY-MM-DD")),
            kWhTilToday: kWhTilToday,
            kWhMom: kWhMom
        });
        console.log(pvDaten);

        pvDaten.save(function (err, pvDaten) {
            if (err) {
                console.log("ACHTUNG " + err);
            } else {
                console.log('saved successfully'); //, catalogObj);
            }
        });
    }
});
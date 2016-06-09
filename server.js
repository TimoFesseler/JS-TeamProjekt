/**
 * Created by Fabian Tschullik on 08.06.2016.
 */


var express = require('express')
    ,   app = express()
    ,   server = require('http').createServer(app)
    ,   io = require('socket.io').listen(server)
    ,   conf = require('./config.json');

var mongoose = require('mongoose');
mongoose.connect('mongodb://87.106.111.229/test');



var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Connected to DBll");




// Weather Model
    var weatherSchema = mongoose.Schema({


        date_time : Date,
        city_id : Number,
        city_name : String,
        cords : {
            lon : Number,
            lat : Number
        },
        sunrise : Number,
        sunset :  Number,

        temp : Number,
        temp_min : Number,
        temp_max : Number,
        rain : String,
        clouds : Number


    });


    var Weather = mongoose.model('weather', weatherSchema);


    var q = Weather.find().sort({'date': -1}).limit(20);
    q.exec(function(err, posts) {

    });




    Weather.find(function (err, abc) {
        if (err) return console.error(err);

        var result = abc


// Websocket
        io.sockets.on('connection', function (socket) {



            // der Client ist verbunden
            socket.emit('chat', result );
            // wenn ein Benutzer einen Text senden
            socket.on('chat', function (data) {
                // so wird dieser Text an alle anderen Benutzer gesendet
                io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data[1].text });
            });
        });





    })});













// Webserver
// auf den Port x schalten
server.listen(conf.port);

// statische Dateien ausliefern
app.use(express.static(__dirname + '/public'));


// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
    // so wird die Datei index.html ausgegeben
    res.sendfile(__dirname + '/public/index.html');
});



// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');
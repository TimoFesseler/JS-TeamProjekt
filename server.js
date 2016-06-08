var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   conf = require('./config.json');

var mongoose = require('mongoose');
var db = mongoose.connection;


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

// Websocket
io.sockets.on('connection', function (socket) {

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


Weather.find(function (err, weather) {
  if (err) return console.error(err);
  console.log(weather);
})


	// der Client ist verbunden
	socket.emit('chat', weather);



db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
});


mongoose.connect('mongodb://localhost/test');



 var collection = db.collection('weather');




// get all the users
collection.find({}, function(err, collection) {
  if (err) throw err;

  // object of all the users
  console.log(collection.date_time);
});





	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
	});
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');
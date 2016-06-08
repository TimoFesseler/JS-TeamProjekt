var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   conf = require('./config.json');

var mongoose = require('mongoose');


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
	// der Client ist verbunden
	socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });


mongoose.connect('mongodb://localhost/test');

 var collection = db.collection('weather');



// get all the users
collection.find({}, function(err, collection) {
  if (err) throw err;

  // object of all the users
  console.log(weather);
});



	socket.emit('weatherNow')



	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
	});
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');
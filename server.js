/**
 * Created by Fabian Tschullik on 08.06.2016.
 */


var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   conf = require('./config.json');


















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

var text = "hhhhhhhhh";
var zeit = new Date();

	// der Client ist verbunden
	socket.emit('chat', { zeit: zeit, text: text });
	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
	});
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');
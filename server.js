var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)


// Webserver
// auf den Port x schalten
server.listen(8081);


app.configure(function(){
	// statische Dateien ausliefern
	app.use(express.static(__dirname + '/public'));
});


// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
	// so wird die Datei index.html ausgegeben
	res.sendfile(__dirname + '/public/index.html');
});


// Websocket
io.sockets.on('connection', function (socket) {
	// der Client ist verbunden
	socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });

	});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');



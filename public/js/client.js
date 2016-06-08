/**
 * Created by Fabian Tschullik on 08.06.2016.
 */


//Verbindung zum Server herstellen

var socket = io.connect();



socket.on('chat', function (data) {


alert('Hallo Welt');

});
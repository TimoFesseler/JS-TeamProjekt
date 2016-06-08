/**
 * Created by Fabian Tschullik on 08.06.2016.
 */


//Verbindung zum Server herstellen

var socket = io.connect();



socket.on('chat', function (data) {





    var zeit = new Date(data.zeit);

    var ort = data.city_name;

alert('Hallo Welt');

});
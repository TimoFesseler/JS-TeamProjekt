/**
 * Created by Fabian Tschullik on 08.06.2016.
 */


//Verbindung zum Server herstellen

var socket = io.connect();



socket.on('chat', function (data) {





    var zeit = new Date(data.zeit);

    var ort = data.city_name;


    $('#content').append(
        $('<li></li>').append(
            // Uhrzeit
            $('<span>').text('[' +
                (zeit.getHours() < 10 ? '0' + ort
                + ':' +
                (zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes())
                + '] '
            ),
            // Name
            $('<b>').text(typeof(data.name) != 'undefined' ? data.city_name + ': ' : ''),
            // Text
            $('<span>').text(data.text))
    );
    // nach unten scrollen
    $('body').scrollTop($('body')[0].scrollHeight);
});
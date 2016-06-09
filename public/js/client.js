$(document).ready(function(){
    // WebSocket
    var socket = io.connect();
    // neue Nachricht
    socket.on('chat', function (data) {


console.log(data[1].city_name);
console.log("aaaaaaaaaaaaaaaaaaaaaaa");



 document.getElementById("ort").innerHTML = data[1].city_name;

 var temp = data[1].temp;
 var temp = temp.toString();


 document.getElementById("temp").innerHTML = temp.slice(0,4);
 document.getElementById("clouds").innerHTML = data[1].clouds;
 document.getElementById("rain").innerHTML = data[1].rain;
  document.getElementById("sunrise").innerHTML = data[1].sunrise;
   document.getElementById("sunset").innerHTML = data[1].sunset;






        var zeit = new Date(data.zeit);
        $('#content').append(
            $('<li></li>').append(
                // Uhrzeit
                $('<span>').text('[' +
                    (zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours())
                    + ':' +
                    (zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes())
                    + '] '
                ),
                // Name
                $('<b>').text(typeof(data.name) != 'undefined' ? data.name + ': ' : ''),
                // Text
                $('<span>').text(data.text))
        );
        // nach unten scrollen
        $('body').scrollTop($('body')[0].scrollHeight);
    });


});
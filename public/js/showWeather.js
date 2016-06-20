$(document).ready(function () {
    // WebSocket
    var socket = io.connect();




    // neue Nachricht
    socket.on('weather', function (result) {

        document.getElementById("ort").innerHTML = result.city_name;

        var temp = result.temp;
        var temp = temp.toString();
        document.getElementById("temp").innerHTML = temp.slice(0, 5)+" C";

        document.getElementById("clouds").innerHTML = result.clouds+" %";
        document.getElementById("rain").innerHTML = result.rain;

        d1=new Date(result.sunrise * 1000);
        document.getElementById("sunrise").innerHTML = d1.getHours()+":"+d1.getMinutes()+" Uhr";

        d2=new Date(result.sunset * 1000);
        document.getElementById("sunset").innerHTML = d2.getHours()+":"+d2.getMinutes()+" Uhr";



    });


});
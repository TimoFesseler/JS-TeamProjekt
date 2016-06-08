/* Creds:  https://www.npmjs.com/package/node-rest-client */

var Client = require('node-rest-client').Client;

var client = new Client();

// direct way
client.get("http://api.openweathermap.org/data/2.5/forecast/city?id=524901&APPID=1ccf6bfbf52e4b3abadde9b4125547d3", function (data, response) {
   // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);

});

// // registering remote methods
// client.registerMethod("jsonMethod", "api.openweathermap.org/data/2.5/weather?q=Stuttgart&APPID=481a70ace50d395a348161874f706968", "GET");
//
// client.methods.jsonMethod(function (data, response) {
//     // parsed response body as js object
//     console.log(data);
//     // raw response
//     console.log(response);
// });


/*
api.openweathermap.org/data/2.5/forecast/city?id=71272&APPID=481a70ace50d395a348161874f706968

API: "481a70ace50d395a348161874f706968"
*/
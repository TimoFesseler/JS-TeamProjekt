/**
 * Created by Affagichtli xD on 02.05.2016.
 */
var Forecast = require('forecast.io');


var options = {
        APIKey: process.env.FORECAST_API_KEY,
        timeout: 1000
    },
    forecast = new Forecast(options);

forecast.get(latitude, longitude, function (err, res, data) {
    if (err) throw err;
    log('res: ' + util.inspect(res));
    log('data: ' + util.inspect(data));
});


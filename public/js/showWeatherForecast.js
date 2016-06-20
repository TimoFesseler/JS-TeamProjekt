/**
 * Created by Fabian Tschullik on 15.06.2016.
 */

$(document).ready(function () {
    // WebSocket
    var socket = io.connect();
    // neue Nachricht
    socket.on('weatherForecast', function (data) {

        var chartData = [];

        for (var i = 0; i < data.forecast.length; i++) {

            var line = {
                date: data.forecast[i].date_time,
                clouds: data.forecast[i].clouds
            };

            chartData.push(line)
            
        }


        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 750 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        var formatDate = d3.time.format("%d-%b-%y");

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.close);
            });

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function draw(data) {

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            y.domain(d3.extent(data, function (d) {
                return d.close;
            }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Wolken in %");

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);
        }

        draw(chartData);

        function type(d) {
            d.date = formatDate.parse(d.date);
            d.close = +d.close;
            return d;
        }


    });
});
/**
 * Created by Fabian Tschullik on 23.06.2016.
 */


$(document).ready(function () {
    // WebSocket
    var socket = io.connect();
    // neue Nachricht

    socket.on('powerForecast', function (data) {

console.log(data);
        var margin = {top: 25, right: 20, bottom: 30, left: 40},
            width = 750 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select("#powerForecast").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        function draw(data) {


            x.domain(data.map(function (d) {
                return d.date;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.power;
            })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 5)
                .attr("dy", ".6em")
                .style("text-anchor", "end")
                .text("Ø Leistung in Watt");

            svg.append("text")
                .attr("x", (width/2))
                .attr("y", 0 - (margin.top/2.8))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Photovoltaik Leistung (5 Tage)");


            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(d.date);
                })
                .attr("width", x.rangeBand())
                .attr("y", function (d) {
                    return y(d.power);
                })
                .attr("height", function (d) {
                    return height - y(d.power);
                });


        }


        draw(data);


        // function type(d) {
        //     d.power = +d.power;
        //     return d;
        // }

    });

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

    socket.on('weatherFiveDay', function (data) {
    console.log(data);

    var margin = {top: 25, right: 20, bottom: 30, left: 40},
                width = 750 - margin.left - margin.right,
                height = 350 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = d3.select("#fiveDays").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            function draw(data) {


                x.domain(data.map(function (d) {
                    return d.date_time;
                }));
                y.domain([0, d3.max(data, function (d) {
                    return d.clouds;
                })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 5)
                    .attr("dy", ".6em")
                    .style("text-anchor", "end")
                    .text("Ø Leistung in Watt");

                svg.append("text")
                    .attr("x", (width/2))
                    .attr("y", 0 - (margin.top/2.8))
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .text("Photovoltaik Leistung (5 Tage)");


                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d) {
                        return x(d.date_time);
                    })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {
                        return y(d.clouds);
                    })
                    .attr("height", function (d) {
                        return height - y(d.clouds);
                    });


            }


            draw(data);


            // function type(d) {
            //     d.power = +d.power;
            //     return d;
            // }














            });

});





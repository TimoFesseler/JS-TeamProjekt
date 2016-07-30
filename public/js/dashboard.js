/**
 * Created by Fabian Tschullik on 23.06.2016.
 */

/*
 ## Clientseitig
 ++++++++   Dashboard Panel: D3-Diagramme für PV-Power und Wetter    +++++++
 */

$(document).ready(function () {
    // WebSocket
    var socket = io.connect();
    // neue Nachricht


    /*
     Zur Darstellung des D3 charts wurden Inhalte aus folgenem Tutorial teilweise entnommen und angepasst:
     https://bl.ocks.org/mbostock/3885304    --> Mike Bostock
     ================================================
     */

    /*
     Zur Darstellung der Tooltips der Charts wurden Inhalte aus:
     http://bl.ocks.org/Caged/6476579    --> Justin Palmer  übernommen
     ================================================
     */


    /*
           PV-Daten-Diagramm letzen 10 Tage
     ================================================
     */
    socket.on('powerForecast', function (data) {
        
        var margin = {top: 25, right: 20, bottom: 30, left: 20},
            width = 750 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([2, width], .15);

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

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>kWh: </strong> <span style='color:red'>" +  Number((d.power).toFixed(1)); + "</span>";
            })

             svg.call(tip);
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
                .text("Tages-Leistung in kWh");

            svg.append("text")
                .attr("x", (width/2))
                .attr("y", 0 - (margin.top/2.8))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Photovoltaik Leistung (letzten 10 Tage)");


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
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }
        
        draw(data);
        
    });



    /*
                   Aktuelles Wetter
     ================================================
     */

    socket.on('weather', function (result) {

            document.getElementById("ort").innerHTML = result.city_name;

            var temp = result.temp;
            var temp = temp.toString();
            document.getElementById("temp").innerHTML = temp.slice(0, 5)+" C";

            document.getElementById("clouds").innerHTML = result.clouds+" %";

            if (result.rain == null){

            document.getElementById("rain").innerHTML = "kein Regen";
            }

            else {

             document.getElementById("rain").innerHTML = result.rain;
            }


            d1=new Date(result.sunrise * 1000);
            document.getElementById("sunrise").innerHTML = d1.getHours()+":"+d1.getMinutes()+" Uhr";

            d2=new Date(result.sunset * 1000);
            document.getElementById("sunset").innerHTML = d2.getHours()+":"+d2.getMinutes()+" Uhr";


        });



    /*
            Wetter-Diagramm letzen 10 Tage
     ================================================
     */
    socket.on('weatherFiveDay', function (data) {

        console.log(data);

    var margin = {top: 25, right: 20, bottom: 30, left: 20},
                width = 750 - margin.left - margin.right,
                height = 350 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([2, width], .15);

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

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Wolkendecke in %:  </strong> <span style='color:red'>" +  Number((d.clouds).toFixed(1));
            })

        svg.call(tip);


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
                    .text("Ø Wolken in %");

                svg.append("text")
                    .attr("x", (width/2))
                    .attr("y", 0 - (margin.top/2.8))
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .text("Wolken in % (letzten 10 Tage)");


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
                        return height - y(d.clouds)
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
            }
        
            draw(data);

            });


    /*
        Ertragsvorschau-Diagramm letzer 5 Tage
     ================================================
     */
    socket.on('powerForecastFive', function (data) {

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

        var svg = d3.select("#powerForecastFive").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Voraussichtlicher Ertrag in kWH:  </strong> <span style='color:red'>" +  Number((d.power).toFixed(1));  + "</span>";
            })

        svg.call(tip);


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
                .text("Tages-Leistung in kWh");

            // svg.append("text")
            //     .attr("x", (width / 2))
            //     .attr("y", 0 - (margin.top / 2.8))
            //     .attr("text-anchor", "middle")
            //     .style("font-size", "16px")
            //     .text("Ertragsvorhersage");


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
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }

        draw(data);

    });
});





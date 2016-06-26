/**
 * Created by fabiantschullik on 09.06.16.
 */

/*
 ## Server-Seitig
 ++++++++   -   ++++++++
 ++++++++   -   ++++++++
 */

$(document).ready(function () {
    // WebSocket
    var socket = io.connect();
    // neue Nachricht
    socket.on('powerForecastFive', function (data) {


        var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Energie-Vorhersage:</strong> <span style='color:red'>" + d.power + "</span>";
            })

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        // d3.tsv("data.tsv", type, function(error, data) {
        //     x.domain(data.map(function(d) { return d.letter; }));
        //     y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

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
            .text("Energie in Watt");

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
            .on('mouseout', tip.hide)

    });

    function type(d) {
        d.power = +d.power;
        return d;
    }
});
















        // var margin = {top: 20, right: 20, bottom: 30, left: 40},
        //     width = 960 - margin.left - margin.right,
        //     height = 500 - margin.top - margin.bottom;
        //
        // var x = d3.scale.ordinal()
        //     .rangeRoundBands([0, width], .1);
        //
        // var y = d3.scale.linear()
        //     .range([height, 0]);
        //
        // var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom");
        //
        // console.log("gafafsf");
        //
        // var yAxis = d3.svg.axis()
        //     .scale(y)
        //     .orient("left")
        //     .ticks(10, "%");
        //
        // var svg = d3.select("bla").append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //
        // d3.tsv("data.tsv", type, function (error, data) {
        //     if (error) throw error;
        //
        //     x.domain(data.map(function (d) {
        //         return d.letter;
        //     }));
        //     y.domain([0, d3.max(data, function (d) {
        //         return d.frequency;
        //     })]);
        //
        //     svg.append("g")
        //         .attr("class", "x axis")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(xAxis);
        //
        //     svg.append("g")
        //         .attr("class", "y axis")
        //         .call(yAxis)
        //         .append("text")
        //         .attr("transform", "rotate(-90)")
        //         .attr("y", 6)
        //         .attr("dy", ".71em")
        //         .style("text-anchor", "end")
        //         .text("Frequency");
        //
        //     svg.selectAll(".bar")
        //         .data(data)
        //         .enter().append("rect")
        //         .attr("class", "bar")
        //         .attr("x", function (d) {
        //             return x(d.letter);
        //         })
        //         .attr("width", x.rangeBand())
        //         .attr("y", function (d) {
        //             return y(d.frequency);
        //         })
        //         .attr("height", function (d) {
        //             return height - y(d.frequency);
        //         });
        // });
        //
        // function type(d) {
        //     d.frequency = +d.frequency;
        //     return d;
        // }
//     });
// });
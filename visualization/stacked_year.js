// Stan Helsloot, 10762388
// makes a stacked barchart for each year

var requests_stacked = [d3.json("../../data/data_refined/stacked_data.json")];

// main function for drawing the stacked barchart
var stacked_year = function() {
    Promise.all(requests_stacked)
            .then(function(response) {
              var draw = stackedMakerYear(response);
            });
  };

// creates a stacked histogram of the earthquakes
function stackedMakerYear(data) {
  // tooltip of stacked_year
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0]);

  // setting size and margins
  var w = 400;
  var h = 400;
  var margin = {
      top: 100,
      right: 50,
      bottom: 20,
      left: 50
    };

  // creating a svg object
  var svg = d3.select("div#earthquake_stacked")
              .append("svg")
              .attr("id", "stacked_year")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // collecting range data length for determining max values in yScale
  var rangeData = [];
  for (var i = 0; i < data[0].length; i++) {
    len = (data[0][i][0][1] + data[0][i][1][1] + data[0][i][2][1] + data[0][i]
      [3][1]);
    rangeData.push(len);
  }

  // setting the yScale
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...rangeData)])
                 .range([h, margin.top]);

  // setting color scale manually
  var color = {
      "1.5": "rgb(186,228,179)",
      "2.0": "rgb(116,196,118)",
      "2.5": "rgb(49,163,84)",
      "3.0": "rgb(0,109,44)"
  };

  // adding groups for rectangle appending
  var groups = svg.append("g")
                  .selectAll("g")
                  .data(data[0])
                  .enter()
                  .append("g");

  // appending rectangles
  groups.selectAll("rect")
        .data(function(d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return (d[0] - 1985) * (w / data[0].length);
        })
        .attr("y", function(d) {
          return yScale(d[3]);
        })
        .attr("height", function(d) {
          return h - yScale(d[1]);
        })
        .attr("width", w / data[0].length)
        .style("fill", function(d) {
          return (color[d[2]]);
        })
        .attr("transform", "translate(" + 39 + ",0)")
        .on('mouseover', function(d) {
          // make a banner with the location and magnitude of the earthquake
          tip.html(function() {
            return "<strong>Year: </strong><span class='details'>" + d[0] +
            "<br></span>" +
            "<strong>Magnitude: </strong><span class='details'>" + d[2] +
            "<br></span>" +
            "<strong>Amount of Earthquakes: </strong><span class='details'>" +
            d[1] + "</span>";
          });
          tip.show();

          d3.select(this)
          .style("fill", "rgba(123,50,148, 0.6)");
        })
        .on('mouseout', function(d) {
          tip.hide();

          d3.select(this)
          .style("fill", function(d) {
            return (color[d[2]]);
          });
        })
        .on("click", function(d) {
          // call function to update the map
          setMap(d[0]);
          // update slider
          sliderMap.value(d[0]);
        });

  // set tip
  svg.call(tip);

  // appending title
  svg.append("text")
     .attr("class", "title")
     .attr("y", margin.top / 6)
     .style("text-anchor", "start")
     .text("Total amount of earthquakes per year and magnitude");

  // setting xScale
  var xScale = d3.scaleLinear()
                 .range([0, w])
                 .domain([1986, 2019]);

  // setting yAxis
  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

  // setting  xAxis
  var xAxis = d3.axisBottom()
                .scale(xScale);

  // appending yAxis
  svg.append("g")
     .attr("class", "yaxis")
     .attr("transform", "translate(" + margin.left + ",0)")
     .call(yAxis);

  // appending axis
  svg.append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(" + margin.left + "," + h + ")")
     .call(xAxis.tickFormat(d3.format(".4")));

  // append xAxis text
  svg.append("text")
     .attr("x", (w + margin.left + margin.right) / 2)
     .attr("transform", "translate(0," + (h + margin.top - margin.bottom) +
       ")")
     .text("Year");

 // Append yAxis text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -h / 2 + 30)
     .attr("y", margin.left / 3)
     .style("text-anchor", "end")
     .text("Amount of earthquakes");

  // make legend for stacked_year (horizontal, located right of chart)
  makeLegend(data);

  // function for making the interactive legend
  function makeLegend(data) {
    // defining legend dimension
    legendPadding = 20;

    data = data[0][0];

    // create legend
    var legend = svg.append("g")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .attr("text-anchor", "end")
                    .selectAll("g")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("transform", function(d, i) {
                      return "translate(0," + i * 25 + ")";
                    })
                    .on("click", function(d) {
                      setMapMagRange(d[2]);
                    });

    //append legend colour blocks
    legend.append("rect")
        .attr("x", w + margin.left * 1.5)
        .attr("y", margin.bottom)
        .attr("width", legendPadding)
        .attr("height", legendPadding)
        .style("fill", function(d) {
          return color[d[2]];
        });

    //append legend texts
    legend.append("text")
          .attr("x", w + margin.left * 1.4)
          .attr("y", margin.bottom * 1.4)
          .attr("dy", "0.32em")
          .text(function(d) {
            return d[2];
          });
    }
}

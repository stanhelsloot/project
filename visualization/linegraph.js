// Stan Helsloot, 10762388
// renders a map of the Netherlands with earthquakes as circles
var requests_line = [d3.json("../../data/data_refined/stacked_data.json"),
                     d3.json("../../data/data_refined/data_years.json")];

var lineDims = {};

var earthquakeYearInitial = 1986;
var earthquakeYearFinal = 2019;
var gasYearInitial = 1963;
var gasYearFinal = 2019;

// main function for creating the map
var line = function() {
  Promise.all(requests_line)
         .then(function(response) {
           var draw = linePlot(response);
         });
};

function linePlot(data) {

  // sizes and margins
  var w = 600;
  var h = 400;
  var margin = {
    top: 80,
    right: 80,
    bottom: 20,
    left: 80
  };
  lineDims.margin = margin;

  // collect the total amount of earthquakes per year
  var earth_data = [];
  earth_data.push({"year": data[0][0][3][0], "value": (data[0][0][3][3])});
  for (var i = 1; i < data[0].length; i++) {
    earth_data.push({"year": data[0][i][3][0], "value": (data[0][i][3][3] + earth_data[i - 1].value)});
  }
  lineDims[4] = earth_data;
  // doing the same for each magnitude
  for (var i = 0; i < 4; i++) {
    var earth_data = [];
    earth_data.push({"year": data[0][0][i][0], "value": (data[0][0][i][1])});
    for (var j = 1; j < data[0].length; j++) {
      earth_data.push({"year": data[0][j][i][0], "value": (data[0][j][i][1] + earth_data[j - 1].value)});
    }
    lineDims[i] = earth_data;
  }

  earth_data = lineDims[4];

  // collect the total amount of gas extracted per year
  extr_data = []
  keys = Object.keys(data[1])
  extr_data.push({"year": keys[0], "value": data[1][keys[0]] / 10e9})
  for (var i = 1; i < keys.length; i++) {
    extr_data.push({"year": keys[i], "value": (data[1][keys[i]] / 10e9 + extr_data[i - 1].value)})
  }

  // setting the y-scale
  var yScale1 = d3.scaleLinear()
                .domain([0, earth_data[earth_data.length - 1].value])
                .range([h, margin.top]);
  lineDims.yScale1 = yScale1

  var yScale2 = d3.scaleLinear()
                  .domain([0, extr_data[extr_data.length - 1].value])
                  .range([h, margin.top])
  lineDims.yScale2 = yScale2

  // create svg canvas
  var svg = d3.select("div#line_plot")
              .append("svg")
              .attr("id", "lineplot")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // appending title to svg object
  svg.append("text")
     .attr("x", w / 2 - margin.left)
     .attr("class", "title")
     .attr("y", margin.top / 2)
     .text("Lineplot of earthquake and extraction totals");

  // creating a function to transform numeric values to date values
  var parseTime = d3.timeParse("%Y")

  // append the converted dates to a list for use in axii and scales
  var yearValues = []
  for (var i = gasYearInitial; i < gasYearFinal; i++){
    yearValues.push(i);
  }

  // set data to yearValues for use in unnamed functions
  data = yearValues

  // setting the xScale (timescale)
  var xScale = d3.scaleLinear()
                 .range([0, w])
                 .domain(d3.extent(yearValues, function(d) { return d }));

  // setting y axis for earthquakes
  var yAxis1 = d3.axisRight()
                .scale(yScale1)
                .ticks(5);

  // setting y axis for extraction
  var yAxis2 = d3.axisLeft()
                .scale(yScale2)
                .ticks(5);

  // setting x xAxis
  var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)

  // appending axis
  svg.append("g")
     .attr("class", "yaxis")
     .attr("transform", "translate(" + (w + margin.left) + ",0)")
     .call(yAxis1);

   svg.append("g")
     .attr("class", "yaxis")
     .attr("transform", "translate(" + margin.left  + ",0)")
     .call(yAxis2);

  // appending axis
  svg.append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(" + margin.left + "," + h + ")")
     .call(xAxis.tickFormat(d3.format(".4")));

  // append xAxis text
  svg.append("text")
      .attr("x", (w + margin.left) / 2)
      .attr("y",  h + margin.bottom * 3)
      // .style("text-anchor", "middle")
      .text("Year");

  // Append yAxis1 text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - h + 50)
     .attr("y", w + margin.right * 2)
     // .style("text-anchor", "middle")
     .text("Amount of Earthquakes")
     .style("font-size", "20px");

  // append yAxis2 text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - h + 25)
     .attr("y", margin.left / 2.2)
     // .style("text-anchor", "middle")
     .text("Total gas extracted in billion Nm^3")
     .style("font-size", "20px");

     data = earth_data
  // define valueline, used for creating the points between which will be drawn
  var valueline1 = d3.line()
      .x(function(d) {
        return xScale(d.year);
      })
      .y(function(d) {
        return yScale1(d.value);
      });
  lineDims.valueline1 = valueline1

  data = extr_data
  // define valueline, used for creating the points between which will be drawn
  var valueline2 = d3.line()
      .x(function(d) {
        return xScale(d.year);
      })
      .y(function(d) {
        return yScale2(d.value);
      });

  // draw it
  svg.append("path")
      .data([extr_data])
      .attr("class", "line")
      .attr("d", valueline2)
      .attr("fill", "none")
      .style("stroke", "purple")
      .style("stroke-width", 4)
      .attr("transform", "translate(" + margin.left + ", 0)");

  // path 2
  svg.append("path")
      .data([earth_data])
      .attr("class", "line")
      .attr("d", valueline1)
      .attr("fill", "none")
      .attr("id", "line"+4+"")
      .style("stroke", "rgb(0,109,44)")
      .style("stroke-width", 4)
      .attr("transform", "translate(" + margin.left + ", 0)");



  svg.append("circle").attr("id", "circle1").attr("r", 7);
  svg.append("circle").attr("id", "circle2").attr("r", 7);

  for (var i = 0; i < 2; i++) {
    tip_extr = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("id", "toolExtra2");

    tip_extr.append("polygon")
              .attr("id", "polymer"+i+"");
    tip_extr.append("rect")
            .attr("id", "tiprect"+i+"");
    tip_extr.append("text")
            .attr("id", "tiptext1"+i+"");
    tip_extr.append("text")
            .attr("id", "tiptext2"+i+"");
  }
  var bisectDate = d3.bisector(function(d) { return d; }).left;
//
//     // create overlay rectange for movemove
  var rect = svg.append("rect")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .style("opacity", 0)
                .attr("transform", "translate(" + margin.left + ", 0)")
                .on("mousemove", function (){
                  // convert pixel data to year data
                  var year = xScale.invert(d3.mouse(rect.node())[0]);
                  // try fitting the data between two existing points
                  var i = bisectDate(yearValues, year, 1);
                  // used to correct the use of margins
                  i = i - 1;
                  // draw tooltipline + display data of pointed to point
                  toolTipLine(earth_data, yearValues[i], h, xScale, extr_data)
                 })
                .on("mouseout", function() {
                  // remove the tooltip + data
                  removeTooltip()
                });

  // checkboxes stuff
  console.log("a");
  d3.selectAll("#all").on("change", function () {
    var x = document.getElementById("all");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      d3.selectAll("#line4").remove();
    }
  });
  // checkboxes stuff
  d3.selectAll("#mag15").on("change", function () {
    var x = document.getElementById("mag15");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      d3.selectAll("#line0").remove();
    }
  });
  // checkboxes stuff
  d3.selectAll("#mag20").on("change", function () {
    var x = document.getElementById("mag20");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      d3.selectAll("#line1").remove();
    }
  });
  // checkboxes stuff
  d3.selectAll("#mag25").on("change", function () {
    var x = document.getElementById("mag25");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      d3.selectAll("#line2").remove();
    }
  });
  // checkboxes stuff
  d3.selectAll("#mag30").on("change", function () {
    var x = document.getElementById("mag30");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      d3.selectAll("#line3").remove();
    }
  });

  function toolTipLine(earth_data, year, h, xScale, extr_data) {
        // update the data which is displayed
        // d3.selectAll("#updatableText").text(function (data) {
          for (let i = 0; i < earth_data.length; i ++){
            // compare with inputted year and select choosen value
            if (earth_data[i].year == year) {
              value = earth_data[i].value
              break
            }
            else if (i == earth_data.length - 1) {
              value = 0
            }
          }
          for (let i = 0; i < extr_data.length; i ++){
            // compare with inputted year and select choosen value
            if (extr_data[i].year == year) {
              value2 = extr_data[i].value
            }
          }
    // XXX:
          d3.selectAll("#circle1")
            .attr("cx", xScale(year) + margin.left)
            .attr("cy", lineDims.yScale2(value2))
          circle1 = d3.selectAll("#circle2")
            .attr("cx", xScale(year) + margin.left)
            .attr("cy", lineDims.yScale1(value))

          valueArray = [value, value2]
          for (var i = 0; i < valueArray.length; i++) {
            x = xScale(year) + margin.left
            if (valueArray[i] == value){
              y = yScale1(valueArray[i])
              text = "Earthquakes"
            } else {
              y = yScale2(valueArray[i])
              text = "M Nm^3 gas"
            }
            var poly = [{"x":x, "y":y},
                        {"x":x - 4,"y":y - 7},
                        {"x":x + 4,"y":y - 7}];

                d3.selectAll("#polymer"+i+"")
                .data([poly])
                .enter()
                .append("polygon")
                .attr("points",function(d) {
                    console.log(d);
                        return d.map(function(d) {
                          console.log(d);
                          return [(d.x),(d.y)].join(",");
                        }).join(" ");
                      })
                      .style("fill", "rgba(0, 0, 0, 0.6)")
                      .attr("transform", "translate(0, -10)");
            d3.selectAll("#tiprect"+i+"")
              .attr("x", x - 65)
              .attr("y", y - 80)
              .attr("height", 60)
              .attr("width", 135)
              .style("fill", "rgba(0, 0, 0, 0.6)");
  d3.selectAll("#tiptext1"+i+"")
              .attr("x", x - 60)
              .attr("y", y - 60)
              .style("fill", "white")
              .style("font-size", "16px")
              .text(function() {
                return "Year: " + year + " ";
              });
        d3.selectAll("#tiptext2"+i+"")
                .attr("x", x  - 60)
                .attr("y", y - 35)
                .style("fill", "white")
                .style("font-size", "16px")
                .text(function() {
                  return ""+ text +": " +
                         Math.round(valueArray[i]) + "";
                });
          }

      }

      function removeTooltip() {
        // d3.selectAll("#toolExtra2")
        //   .remove()
        console.log("a");
    }
}

function updateGraph(value) {
  var colorLine = ["rgb(199,233,192)", "rgb(186,228,179)", "rgb(116,196,118)",
                   "rgb(49,163,84)", "rgb(0,109,44)"]

  d3.selectAll("#lineplot").append("path")
      .data([lineDims[value]])
      .attr("class", "line")
      .attr("d", lineDims.valueline1)
      .attr("fill", "none")
      .attr("id", "line"+value+"")
      .style("stroke", colorLine[value])
      .style("stroke-width", 4)
      .attr("transform", "translate(" + lineDims.margin.left + ", 0)");
}

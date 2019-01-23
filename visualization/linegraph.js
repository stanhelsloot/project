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
  // tooltip of bar_month
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0]);

  barDims.tip = tip

  // sizes and margins
  var w = 800;
  var h = 600;
  var margin = {
    top: 80,
    right: 50,
    bottom: 20,
    left: 50
  };

  // collect the total amount of earthquakes per year
  earth_data = []
  earth_data.push({"year": data[0][0][3][0], "value": (data[0][0][3][3])})
  for (var i = 1; i < data[0].length; i++) {
    earth_data.push({"year": data[0][i][3][0], "value": (data[0][i][3][3] + earth_data[i - 1].value)})
  }

  // collect the total amount of gas extracted per year
  extr_data = []
  keys = Object.keys(data[1])
  extr_data.push({"year": keys[0], "value": data[1][keys[0]]})
  for (var i = 1; i < keys.length; i++) {
    extr_data.push({"year": keys[i], "value": (data[1][keys[i]] + extr_data[i - 1].value)})
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
     .attr("x", w / 2)
     .attr("class", "title")
     .attr("y", margin.top / 2)
     .style("text-anchor", "middle")
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
  var yAxis1 = d3.axisLeft()
                .scale(yScale1)
                .ticks(5);

  // setting y axis for extraction
  var yAxis2 = d3.axisRight()
                .scale(yScale2)
                .ticks(5);

  // setting x xAxis
  var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)

  // appending axis
  svg.append("g")
     .attr("class", "yaxis")
     .attr("transform", "translate(" + margin.left + ",0)")
     .call(yAxis1)
     .style("font-size", "15px");

   svg.append("g")
     .attr("class", "yaxis")
     .attr("transform", "translate(" + (w + margin.left)  + ",0)")
     .call(yAxis2)
     .style("font-size", "15px");

  // appending axis
  svg.append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(" + margin.left + "," + h + ")")
     .call(xAxis)
     .style("font-size", "15px");

  // append xAxis text
  svg.append("text")
      .attr("transform", "translate(" + (w/2) + " ," +
                         (h + margin.top) + ")")
      .style("text-anchor", "middle")
      .text("Year")
      .style("font-size", "20px");

  // Append yAxis1 text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - h/2 + 30)
     .attr("y", margin.left / 2)
     .style("text-anchor", "middle")
     .text("Amount of Earthquakes")
     .style("font-size", "20px");

  // append yAxis2 text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - h/2 + 30)
     .attr("y", w + margin.right * 2)
     .style("text-anchor", "middle")
     .text("Total gas extracted")
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
      .attr("fill", "white")
      .style("stroke", "orange")
      .style("stroke-width", 4)
      .attr("transform", "translate(" + margin.left + ", 0)");

  // path 2
  svg.append("path")
      .data([earth_data])
      .attr("class", "line")
      .attr("d", valueline1)
      .attr("fill", "white")
      .style("stroke", "purple")
      .style("stroke-width", 4)
      .attr("transform", "translate(" + margin.left + ", 0)");

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

    svg.append("line").attr("id", "tipline");
    svg.append("circle").attr("id", "circle1").attr("r", 7);
    svg.append("circle").attr("id", "circle2").attr("r", 7);


     // add text (withouth text) to the plot
     svg.append("text")
        .attr("id", "text_1");

        svg.append("text")
           .attr("id", "text_2");

  //
  function toolTipLine(earth_data, year, h, xScale, extr_data) {
        // select the tipline of the svg
        var  tipLine = d3.selectAll("#tipline")
        // draw the line
        tipLine.attr('stroke', 'black')
               .attr('x1', xScale(year) + margin.left)
               .attr('x2', xScale(year) + margin.left)
               .attr('y1', margin.top)
               .attr('y2', h)

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
          // return ("Year: "+ year + " Earthquakes: " + value + " Extracted: "+ Math.round(value2 / 10e9) +"")
          // select circles

          d3.selectAll("#circle2")
            .attr("cx", xScale(year) + margin.left)
            .attr("cy", lineDims.yScale2(value2))

          if (value != 0) {
            circle1 = d3.selectAll("#circle1")
              .attr("cx", xScale(year) + margin.left)
              .attr("cy", lineDims.yScale1(value))
              .attr("r", 7)
            text1 = d3.selectAll("#text_1")
              .attr("x", xScale(year) + margin.left)
              .attr("y", lineDims.yScale1(value))
              .text("Year: " + year + " Total Earthquakes: " + value + "")
              .attr("transform", "translate(" + 20 + ", 0)")
          } else {
            // remove the tipcircle & text
            circle1.attr("r", 0)
            text1.text("")
          }

          d3.selectAll("#text_2")
            .attr("x", xScale(year) + margin.left)
            .attr("y", lineDims.yScale2(value2))
            .text("Year: " + year + " Gas extracted in billion Nm^3: " + Math.round(value2 / 10e9) + " ")
            .attr("transform", "translate(" + 20  + ", 0)")

        // });
      }

      function removeTooltip() {
        // request tipline
        var  tipLine = d3.selectAll("#line")
        // set tipline to zero
        if (tipLine) tipLine.attr('stroke', 'none');
        // request text
        var  text = d3.selectAll("#updatableText")
        // set text to 0
        if (text) text.text("");
    }

}

// Stan Helsloot, 10762388
// renders a map of the Netherlands with earthquakes as circles
var requestsLine = [d3.json("../../data/data_refined/stacked_data.json"),
                     d3.json("../../data/data_refined/data_years.json")];

var lineDims = {};

var earthquakeYearInitial = 1986;
var earthquakeYearFinal = 2019;
var gasYearInitialLine = 1963;
var gasYearFinal = 2019;

// main function for creating the map
var line = function() {
  Promise.all(requestsLine)
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
    right: 280,
    bottom: 20,
    left: 180
  };
  lineDims.w = w;
  lineDims.h = h;
  lineDims.margin = margin;

  // collect the total accumulated amount of earthquakes per year
  var earthData = [];
  earthData.push({"year": data[0][0][3][0], "value": (data[0][0][3][3])});
  for (var i = 1; i < data[0].length; i++) {
    earthData.push({"year": data[0][i][3][0], "value": (data[0][i][3][3] + earthData[i - 1].value)});
  }
  lineDims[4] = earthData;

  // doing the same for each magnitude
  for (i = 0; i < 4; i++) {
    earthData = [];
    earthData.push({"year": data[0][0][i][0], "value": (data[0][0][i][1])});
    for (var j = 1; j < data[0].length; j++) {
      earthData.push({"year": data[0][j][i][0], "value": (data[0][j][i][1] + earthData[j - 1].value)});
    }
    lineDims[i] = earthData;
  }

  earthData = lineDims[4];

  // collect the total amount of gas extracted per year and saving as dict
  extractionData = [];
  keys = Object.keys(data[1]);
  extractionData.push({"year": keys[0], "value": data[1][keys[0]] / 10e9});
  for (i = 1; i < keys.length; i++) {
    extractionData.push({"year": keys[i], "value": (data[1][keys[i]] / 10e9 + extractionData[i - 1].value)});
  }

  // setting the y-scale with the last instance of the dictionary
  var yScale1 = d3.scaleLinear()
                .domain([0, earthData[earthData.length - 1].value])
                .range([h, margin.top]);
  lineDims.yScale1 = yScale1;

  // setting the y-scale with the last instance of the dictionary
  var yScale2 = d3.scaleLinear()
                  .domain([0, extractionData[extractionData.length - 1].value])
                  .range([h, margin.top]);
  lineDims.yScale2 = yScale2;

  // create svg canvas
  var svg = d3.select("div#linePlot")
              .append("svg")
              .attr("id", "linePlot")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // appending title to svg object
  svg.append("text")
     .attr("x", w / 2 - margin.left)
     .attr("class", "title")
     .attr("y", margin.top / 2)
     .text("linePlot of earthquake and extraction totals");

  // creating a function to transform numeric values to date values
  var parseTime = d3.timeParse("%Y");

  // append the converted dates to a list for use in axii and scales
  var yearValues = [];
  for (i = gasYearInitialLine; i < gasYearFinal; i++){
    yearValues.push(i);
  }

  // set data to yearValues for use in unnamed functions
  data = yearValues;

  // setting the xScale
  var xScale = d3.scaleLinear()
                 .range([0, w])
                 .domain(d3.extent(yearValues, function(d) {
                   return d;
                  }));

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
                .ticks(10);

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
      .attr("x", (w + margin.left) / 1.75)
      .attr("y",  h + margin.bottom * 3)
      .text("Year");

  // Append yAxis1 text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - h + 50)
     .attr("y", w + margin.right / 1.2)
     .text("Amount of Earthquakes")
     .style("font-size", "20px");

  // append yAxis2 text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", - h + 25)
     .attr("y", margin.left / 1.3)
     .text("Total gas extracted in billion Nm^3")
     .style("font-size", "20px");

  // define valueline, used for creating the points between which will be drawn
  var valueline1 = d3.line()
                     .x(function(d) {
                       return xScale(d.year);
                     })
                     .y(function(d) {
                       return yScale1(d.value);
                     });
  lineDims.valueline1 = valueline1;

  // define valueline, used for creating the points between which will be drawn
  var valueline2 = d3.line()
                     .x(function(d) {
                       return xScale(d.year);
                     })
                     .y(function(d) {
                       return yScale2(d.value);
                     });

  // draw line 1
  svg.append("path")
      .data([extractionData])
      .attr("class", "line")
      .attr("d", valueline2)
      .attr("fill", "none")
      .style("stroke", "purple")
      .style("stroke-width", 4)
      .attr("transform", "translate(" + margin.left + ", 0)");

  // path 2
  svg.append("g")
      .attr("id", "linePlotGroup")
      .append("path")
      .data([earthData])
      .attr("class", "line")
      .attr("d", valueline1)
      .attr("fill", "none")
      .attr("id", "line"+4+"")
      .style("stroke", "rgb(0,109,44)")
      .style("stroke-width", 4)
      .attr("transform", "translate(" + margin.left + ", 0)");


  circleGroupLine = svg.append("g")
                       .attr("id", "circleGroupLine");

  // make 5 circles and append them to the group of circles
  for (i = 0; i < 6; i++) {
    circleGroupLine.append("circle")
                   .attr("id", "tipCircle"+i+"")
                   .attr("r", 0);
  }

  // set bisector for finding the closest data point in the data
  var bisectDate = d3.bisector(function(d) {
                                 return d;
                              }).left;

  // create overlay rectange for mousemove
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
                  toolTipLine(earthData, yearValues[i], h, xScale, extractionData);
                })
                .on("mouseout", function() {
                  // remove the tooltip + data
                  removeTooltip();
                });

  // tooltip margins
  var toolMargins = {};
  toolMargins.x = 860;
  toolMargins.y = 180;
  toolMargins.padding = 20;

  // tooltip box for displaying data
  var tipBox = svg.append("g")
                  .attr("id", "tipBox");

  tipBox.append("rect")
        .attr("id", "tipRect");

  tipBox.append("text")
        .attr("id", "tipTextYear")
        .attr("x", toolMargins.x)
        .attr("y", toolMargins.y);

  tipBox.append("text")
        .attr("id", "tipTextExtr")
        .attr("x", toolMargins.x)
        .attr("y", toolMargins.y + toolMargins.padding);

  for (i = 0; i < 5; i++){
    tipBox.append("text").attr("id", "tipText"+i+"").attr("x", toolMargins.x);
  }

  // creating a foreignObject for holding the checkboxes
  var obj = svg.append("foreignObject")
               .attr("x", margin.right * 0.20)
               .attr("y", 105)
               .attr("width", toolMargins.padding)
               .attr("height", toolMargins.y + toolMargins.padding);

  // adding a div in the object to the html page
  div = obj.append("xhtml:div")
           .append("div")
           .attr("class", "checkbox");

  // add a checkbox
  div.append("input")
     .attr("type", "checkbox")
     .attr("id", "all")
     .attr("value", "4")
     .attr("checked", "")
     .attr("autocomplete", "off");

  // add a checkbox
  div.append("input")
     .attr("type", "checkbox")
     .attr("id", "mag15")
     .attr("value", "0")
     .attr("autocomplete", "off")
     .html("mag15");

  // add a checkbox
  div.append("input")
     .attr("type", "checkbox")
     .attr("id", "mag20")
     .attr("value", "1")
     .attr("autocomplete", "off");

  // add a checkbox
  div.append("input")
     .attr("type", "checkbox")
     .attr("id", "mag25")
     .attr("value", "2")
     .attr("autocomplete", "off");

  // add a checkbox
  div.append("input")
     .attr("type", "checkbox")
     .attr("id", "mag30")
     .attr("value", "3")
     .attr("autocomplete", "off");

  // this checkbox is always checked upon loading and therefor always true in
  // the first instance. When a box is clicked, it goes through these blocks
  // to determine the action (either plot the line or remove the line)
  lineDims.bool4 = true;
  d3.selectAll("#all").on("change", function () {
    var x = document.getElementById("all");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      lineDims.bool4 = false;
      d3.selectAll("#line4").remove();
    }
  });

  // second checkbox
  d3.selectAll("#mag15").on("change", function () {
    var x = document.getElementById("mag15");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      lineDims.bool0 = false;
      d3.selectAll("#line0").remove();
    }
  });

  // third checkbox
  d3.selectAll("#mag20").on("change", function () {
    var x = document.getElementById("mag20");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      lineDims.bool1 = false;
      d3.selectAll("#line1").remove();
    }
  });

  // fourth checkbox
  d3.selectAll("#mag25").on("change", function () {
    var x = document.getElementById("mag25");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      lineDims.bool2 = false;
      d3.selectAll("#line2").remove();
    }
  });

  // fifth checkbox
  d3.selectAll("#mag30").on("change", function () {
    var x = document.getElementById("mag30");
    if (x.checked) {
      updateGraph(parseInt(x.value));
    } else {
      lineDims.bool3 = false;
      d3.selectAll("#line3").remove();
    }
  });

  // set the dimentions, data, text and color gradients for the legend
  var legendPadding = 20;
  data = [0, 1, 2, 3, 4, 5];
  var text = ["Gas", "All", "1.5 to 2.0", "2.0 to 2.5", "2.5 to 3.0", "3.0+"];
  var color = ["purple",
               "rgb(0,109,44)",
               "rgb(199,233,192)",
               "rgb(186,228,179)",
               "rgb(116,196,118)",
               "rgb(49,163,84)"];

  // append legend group
  var legend = svg.append("g")
                  .attr("font-family", "sans-serif")
                  .attr("font-size", 10)
                  .attr("text-anchor", "end")
                  .selectAll("g")
                  .data(data)
                  .enter()
                  .append("g")
                  .attr("transform", function(d, i) {
                    return "translate(0," + i * 24 + ")";
                  });

  // append legend colour blocks
  legend.append("rect")
      .attr("x", margin.right * 0.3 - 5)
      .attr("y", margin.top + 3)
      .attr("width", legendPadding)
      .attr("height", legendPadding)
      .style("fill", function(d) {
        console.log(d);
        return color[d];
      });

  //append legend texts
  legend.append("text")
        .attr("x", margin.right * 0.17)
        .attr("y", margin.top + 5)
        .attr("dy", "1em")
        .text(function(d) {
          return text[d];
        });

  // function for adding the tooltip information
  function toolTipLine(earthData, year, h, xScale, extractionData) {
    // text to be plotted in the toolbox
    var text = ["1.5 to 2.0", "2.0 to 2.5", "2.5 to 3.0", "3.0 and above", "All Earthquakes"];
    yDistance = 200;
    paddingFactor = 0;

    // set the value of the selected year
    for (var i = 0; i < extractionData.length; i ++){
      // compare with inputted year and select choosen value
      if (extractionData[i].year == year) {
        value2 = extractionData[i].value;
      }
    }

    // set the first text
    d3.selectAll("#tipTextExtr")
      .style("fill", "white")
      .style("font-size", "16px")
      .text(function() {
        return "Gas extracted: " + Math.round(value2) + "";
      });

    // set the first circle, doing this seperately due to the different yScale
    circle1 = d3.selectAll("#tipCircle5")
                .attr("r", 7)
                .attr("cx", xScale(year) + margin.left)
                .attr("cy", lineDims.yScale2(value2));

    for (i = 0; i < 5; i++) {
      for (var j = 0; j < lineDims[i].length; j ++){
        // compare with inputted year and select choosen value
        if (lineDims[i][j].year == year) {
          value = lineDims[i][j].value;
          // break if the correct value has been found
          break;
        }
        else if (j == lineDims[i].length - 1) {
          value = 0;
        }
      }
      // draw the circles and text
      if (value != 0 && lineDims["bool"+i+""]) {
        d3.selectAll("#tipCircle"+i+"")
          .attr("r", 7)
          .attr("cx", xScale(year) + margin.left)
          .attr("cy", lineDims.yScale1(value));
        k++;
        // text is added according to how many checkboxes are filled
        d3.selectAll("#tipText"+i+"")
          .attr("y", yDistance + paddingFactor * 20)
          .style("fill", "white")
          .style("font-size", "16px")
          .text(function() {
            return ""+ text[i] +": " + value + "";
          });
      } else {
        // remove text & circle
        d3.selectAll("#tipCircle"+i+"")
          .attr("r", 0);
        d3.selectAll("#tipText"+i+"")
          .text("");
      }
    }

    // create rectangle for text
    tipRect = d3.select("#tipRect")
                .attr("x", 855)
                .attr("y", 155)
                .attr("height", 60 + k * 20)
                .attr("width", 155)
                .style("fill", "rgba(0, 0, 0, 0.6)");

    // Add text
    d3.selectAll("#tipTextYear")
      .style("fill", "white")
      .style("font-size", "16px")
      .text(function() {
        return "Year: " + year + " ";
      });
  }

  // function for removing tooltip of linegraph
  function removeTooltip() {
    for (var i = 0; i < 6; i++) {
      d3.selectAll("#tipCircle"+i+"")
        .attr("r", 0);
    }
  }
}

// function for updating the line plot
function updateGraph(value) {
  // setting color scheme
  var colorLine = ["rgb(199,233,192)", "rgb(186,228,179)", "rgb(116,196,118)",
                   "rgb(49,163,84)", "rgb(0,109,44)"];

  // adding path
  d3.selectAll("#linePlotGroup").append("path")
    .data([lineDims[value]])
    .attr("class", "line")
    .attr("d", lineDims.valueline1)
    .attr("fill", "none")
    .attr("id", "line"+value+"")
    .style("stroke", colorLine[value])
    .style("stroke-width", 4)
    .attr("transform", "translate(" + lineDims.margin.left + ", 0)");

  // set bool for easy indentification
  lineDims["bool"+value+""] = true;
}

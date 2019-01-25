// Stan Helsloot, 10762388

// Renders a histogram of the yearly gas extraction by NAM
var requests_bar_month = [d3.json("../../data/data_refined/data_months.json")];

// for storage of global variables in update functions
var barDims = {};

var gasYearInitial = 1971;
var gasYearFinal = 2019;

var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
             "Oct", "Nov", "Dec"];

// main function for making monthly gas extraction histogram.
var bar_month = function() {
  Promise.all(requests_bar_month)
         .then(function(response) {
           var draw = barMakerMonth(response);
         });
};

// creates the first histogram
function barMakerMonth(data) {

  // tooltip of bar_month
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0]);

  barDims.tip = tip

  // sizes and margins
  var w = 400;
  var h = 300;
  var margin = {
    top: 80,
    right: 50,
    bottom: 20,
    left: 50
  };

  // adding the measurements to the global variable barDims
  barDims.w = w;
  barDims.h = h;
  barDims.margin = margin;

  // creating a svg object and adding it to an specified element on the page
  var svg = d3.select("div#extraction_month")
              .append("svg")
              .attr("id", "month")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // selecting the correct data and obtaining the keys
  data = data[0];
  var keys = Object.keys(data);

  // collect, process and save data of all years
  for (var j = gasYearInitial; j < gasYearFinal; j++) {
    var data_refined = [];
    for (i = 0; i < keys.length; i++) {
      if (parseInt(keys[i]) == j) {
        // convert the numeric data to [data] billion m^3
        data_refined.push([month[i % 12], data[keys[i]] / 1e9]);
      }
      barDims[j] = data_refined;
    }
  }

  // collect extraction data per year to obtain maximum value per year
  var extraction_data = [];
  for (i = 0; i < barDims[2018].length; i++) {
    extraction_data.push(barDims[2018][i][1]);
  }
  data = data_refined;

  // setting the yScale and making it global for use in update function
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...extraction_data)])
                 .range([h, margin.top]);
  barDims.yScale = yScale;

  // creating the bars for the histogram
  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("id", "rect")
     .attr("width", w / data.length)
     .attr("transform", "translate(" + margin.left + ",0)")
     .attr("x", function(d, i) {
       return i * (w / data.length);
     })
     .attr("y", function(d) {
       return yScale(d[1]);
     })
     .attr("height", function(d) {
       return h - yScale(d[1]);
     })
     .style("fill", "rgba(150,150,150, 1)")
     .on('mouseover', function(d) {

       // make a banner with the month and amount of gas extracted
       tip.html(function() {
         return "<strong>Month: </strong><span class='details'>" + d[0] +
                "<br></span>" +
                "<strong>Gas in billion Nm^3: </strong><span class='details'>" +
                Math.round(d[1] * 100) / 100 + "</span>";
       });
       tip.show();
       d3.select(this)
       .style("fill", "rgba(123,50,148, 1)");
     })
     .on('mouseout', function(d) {
       tip.hide();
       d3.select(this)
       .style("fill", "rgba(150,150,150, 1)");
     });

  // activating the tooltip
  svg.call(tip);

  // appending title
  svg.append("text")
     .attr("id", "bar_month_title")
     .attr("class", "title")
     .attr("y", margin.top / 2)
     .attr("x", margin.left)
     .text("Monthly total of gas extracted in 2018");

  // set xScale using the name abbreviation per month
  var xScale = d3.scaleBand()
                 .rangeRound([0, w])
                 .padding(0.1)
                 .domain(month);

  // setting yAxis
  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);
  // globalize yAxis
  barDims.yAxis = yAxis

  // setting xAxis
  var xAxis = d3.axisBottom()
                .scale(xScale);

  // appending yAxis
  svg.append("g")
     .attr("class", "yaxis")
     .attr("id", "month_y")
     .attr("transform", "translate(" + margin.left + ",0)")
     .call(yAxis);

  // appending xAxis
  svg.append("g")
    .attr("class", "xaxis")
    .attr("id", "month_x")
    .attr("transform", "translate(" + margin.left + "," + h + ")")
    .call(xAxis);

  // append xAxis text
  svg.append("text")
     .attr("transform", "translate(" + (w / 2) + " ," +
       (h + margin.top / 1.5) + ")")
     .style("text-anchor", "start")
     .text("Month");

  // Append yAxis text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -h)
     .attr("y", margin.left / 3)
     .text("Gas extraction in billion Nm^3");
}

// update function for the monthly extraction chart
function set_year(year) {
  // select and update title with selected year
  d3.selectAll("#bar_month_title")
    .text("Monthly total of gas extracted in " + year + "");

  // select the choosen year
  data = barDims[year];

  // collecting extraction data of choosen year for use in setting yScale
  var extraction_data = [];
  for (i = 0; i < data.length; i++) {
    extraction_data.push(data[i][1]);
  }

  // setting the yScale
  var yScale = barDims.yScale.domain([0, Math.max(...extraction_data)]);

  // select the correct svg
  var svg = d3.selectAll("#month");

  // changing the rectangles to fit the new data
  var rect = svg.selectAll("#rect")
                .data(data)
                .transition()
                .duration(750)
                .attr("height", function(d) {
                  return barDims.h - yScale(d[1]);
                })
                .attr("y", function(d) {
                  return yScale(d[1]);
                });

  // updating the axis to addapt to the new yScale
  // barDims.yAxis.scale(yScale)
  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

  d3.selectAll("#month_y")
    .transition()
    .duration(750)
    .call(yAxis);
}

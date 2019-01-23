// Stan Helsloot, 10762388

// Renders a histogram of the yearly gas extraction by NAM
var request_month_earth = [d3.json("../../data/data_refined/stacked_tot.json")];

// for storage of global variables in update functions
var barDims = {};

var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
             "Oct", "Nov", "Dec"];

// main function for making monthly gas extraction histogram.
var tot_month_earth = function() {
  Promise.all(request_month_earth)
         .then(function(response) {
           var draw = barMakerTotEarth(response);
         });
};

// creates the first histogram
function barMakerTotEarth(data) {

  // tooltip of bar_month
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0]);

  // sizes and margins
  var w = 400;
  var h = 300;
  var margin = {
    top: 80,
    right: 50,
    bottom: 20,
    left: 50
  };

  // creating a svg object and adding it to an specified element on the page
  var svg = d3.select("div#earth_total")
              .append("svg")
              .attr("id", "month")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // selecting the correct data and obtaining the keys
  data = data[0];
  var extraction_data = [];
  // collect, process and save data of all years
  for (var i = 0; i < data.length; i++) {
     // convert the numeric data to [data] billion m^3
     extraction_data.push(data[i][1]);
  }

  // setting the yScale and making it global for use in update function
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...extraction_data)])
                 .range([h, margin.top]);

  // creating the bars for the histogram
  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("id", "rect_tot")
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
     .attr("id", "bar_tot_title")
     .attr("class", "title")
     .attr("y", margin.top / 2)
     .attr("x", margin.left)
     .text("Total gas extracted per month between 1971 and 2018");

  // set xScale using the name abbreviation per month
  var xScale = d3.scaleBand()
                 .rangeRound([0, w])
                 .padding(0.1)
                 .domain(month);

  // setting yAxis
  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

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

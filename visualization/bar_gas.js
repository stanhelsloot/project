// Stan Helsloot, 10762388
// Renders a histogram of the yearly gas extraction by NAM
var requests_bar_year = [d3.json("../../data/data_refined/data_years.json")];

// main function for creating a yearly extraction histogram
var bar_year = function() {
  Promise.all(requests_bar_year)
         .then(function(response) {
           var draw = barMakerYear(convertData(response));
         });
};

// creates a histogram using the same dimentions as bar_gas_month.js
function barMakerYear(data) {

  // tooltip of bar_year
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

  // creating a svg object
  var svg = d3.select("div#extraction_year")
              .append("svg")
              .attr("id", "year")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // merging extraction data for determination of maximum extraction
  var extraction_data = [];
  for (i = gasYearInitial; i < gasYearFinal; i++) {
    extraction_data.push(data[-gasYearInitial + i][1]);
  }

  // setting the y-scale
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...extraction_data)])
                 .range([h, margin.top]);
                 
  // creating the bars for the histogram
  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
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
       // make a banner with the total year extraction + the selected year
       tip.html(function() {
         return "<strong>Year: </strong><span class='details'>" + d[0] +
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
     })
     .on("click", function(d) {
       // update monthly map
       set_year(d[0]);
     });

  // calling tip
  svg.call(tip);

  // appending title
  svg.append("text")
     .attr("class", "title")
     .attr("y", margin.top / 2)
     .attr("x", margin.left)
     .text("Yearly total of gas extacted");

  // setting xScale
  var xScale = d3.scaleLinear()
                 .range([0, w])
                 .domain([gasYearInitial, gasYearFinal]);

  // setting y axis
  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

  // setting x xAxis
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
     .attr("transform", "translate(" + margin.left + "," + h +
       ")")
     .call(xAxis.tickFormat(d3.format(".4")));

  // append xAxis text
  svg.append("text")
     .attr("transform", "translate(" + (w / 2) + " ," + (h +
       margin.top / 1.5) + ")")
     .style("text-anchor", "start")
     .text("Year");
  // Append yAxis text
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -h / 2 + 30)
     .attr("y", margin.left / 3)
     .style("text-anchor", "end")
     .text("Gas extraction in Nm^3");
}

function convertData(data) {
  // converts the dict format to an array
  data = data[0];
  data_refined = [];
  for (i = 1971; i < 2019; i++) {
    j = data["" + i];

    // convert data to billion m^3
    j = (j / 1e9);
    data_refined.push([i, j]);
  }
  return data_refined;
}

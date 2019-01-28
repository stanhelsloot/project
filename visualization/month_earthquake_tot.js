// Stan Helsloot, 10762388

// Renders a histogram of the yearly gas extraction by NAM
var request_month_earth = [d3.json("../../data/data_refined/stacked_tot.json")];

// for storage of global variables in update functions
var totDimsEarth = {};

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
  totDimsEarth.w = w;

  // creating a svg object and adding it to an specified element on the page
  var svg = d3.select("div#earth_total")
              .append("svg")
              .attr("id", "earth_total_month")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // selecting the correct data and obtaining the keys
  data = data[0];
  var extraction_data = [];
  // collect, process and save data of all years
  for (var i = 0; i < data.length; i++) {
     extraction_data.push(data[i][1]);
  }
  totDimsEarth.data_refined = data;

  // setting the yScale and making it global for use in update function
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...extraction_data)])
                 .range([h, margin.top]);
  totDimsEarth.yScale = yScale;

  // creating the bars for the histogram
  svg.append("g")
     .selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("id", function (d) {
       return d[0];
     })
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
                "<strong>Earthquakes: </strong><span class='details'>" +
                Math.round(d[1]) + "</span>";
       });
       tip.show();

       id = this.id
       tip_other(id);
       d3.selectAll("#"+id+"")
       .style("fill", "rgba(123,50,148, 1)");
     })
     .on('mouseout', function(d) {
       removeTipOther()
       tip.hide();
       id = this.id
       d3.selectAll("#"+id+"")
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
     .text("Total earthquakes per month between 1986 and 2018");

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
     .text("Total amount of Earthquakes");
}
function tip_other2(id) {
  data_refined = totDimsEarth.data_refined;
  for (var i = 0; i < data_refined.length; i++) {
    if (data_refined[i][0] == id) {
      data = data_refined[i][1]
    }
  }
  // set x location, can be determined using the id
  x_pre = month.findIndex(function (element) {
    return element == id;
  })
  x = x_pre * (totDimsEarth.w / month.length)
  y = totDimsEarth.yScale(data)
  var poly = [{"x":x, "y":y},
              {"x":x - 4,"y":y - 7},
              {"x":x + 4,"y":y - 7}];

  var tip_extr =
  d3.selectAll("#earth_total_month")
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("id", "toolExtra");

  tip_extr.selectAll("polygon")
            .data([poly])
            .enter()
            .append("polygon")
            .attr("points",function(d) {
              return d.map(function(d) {
                return [(d.x),(d.y)].join(",");
              }).join(" ");
            })
            .style("fill", "rgba(0, 0, 0, 0.6)")
            .attr("transform", "translate(" + 67  + ",0)");
  tip_extr.append("rect")
    .attr("x", x)
    .attr("y", y - 70)
    .attr("height", 60)
    .attr("width", 130)
    .style("fill", "rgba(0, 0, 0, 0.6)");
  tip_extr.append("text")
    .attr("x", x + 5)
    .attr("y", y - 50)
    .style("fill", "white")
    .style("font-size", "16px")
    .text(function() {
      return "Month: " + id + " ";
    });
    tip_extr.append("text")
      .attr("x", x + 5)
      .attr("y", y - 25)
      .style("fill", "white")
      .style("font-size", "16px")
      .text(function() {
        return "Earthquakes: " +
               data + "";
      });
}
function removeTipOther2() {
  d3.selectAll("#toolExtra")
    .remove()

}

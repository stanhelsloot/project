// Stan Helsloot, 10762388

// Renders a histogram of the yearly gas extraction by NAM
var request_bar_tot = [d3.json("../../data/data_refined/data_tot.json")];

// for storage of global variables in update functions
var totDimsExtr = {};

var gasYearInitial = 1971;
var gasYearFinal = 2019;

var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
             "Oct", "Nov", "Dec"];

// main function for making monthly gas extraction histogram.
var tot_month = function() {
  Promise.all(request_bar_tot)
         .then(function(response) {
           var draw = barMakerTot(response);
         });
};

// creates the first histogram
function barMakerTot(data) {

  // tooltip of bar_month
  var tip_extr = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0]);


  // sizes and margins
  var w = 400;
  var h = 300;
  var margin = {
    top: 80,
    right: 60,
    bottom: 20,
    left: 60
  };
  totDimsExtr.w = w
  totDimsExtr.h = h
  totDimsExtr.margin = margin

  // // adding the measurements to the global variable barDims
  // barDims.w = w;
  // barDims.h = h;
  // barDims.margin = margin;

  // creating a svg object and adding it to an specified element on the page
  var svg = d3.select("div#extraction_total")
              .append("svg")
              .attr("id", "month_total")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // selecting the correct data and obtaining the keys
  data = data[0];
  var data_refined = [];
  var keys = Object.keys(data);
  var extraction_data = [];
  // collect, process and save data of all years
  for (var i = 0; i < keys.length; i++) {
     // convert the numeric data to [data] billion m^3
     extraction_data.push(data[keys[i]] / 1e9);
     data_refined.push([keys[i], data[keys[i]] / 1e9]);

  }
  totDimsExtr.data_refined = data_refined

  // setting the yScale and making it global for use in update function
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...extraction_data)])
                 .range([h, margin.top]);
  totDimsExtr.yScale = yScale
  // data = extraction_data
  data = data_refined;
  // creating the bars for the histogram
  svg.selectAll("rect")
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
       tip_extr.html(function() {
        return "<strong>Month: </strong><span class='details'>" + d[0] +
               "<br></span>" +
               "<strong>Gas in M Nm^3: </strong><span class='details'>" +
               Math.round(d[1]) + "</span>";
      });
      tip_extr.show();

       id = this.id
       tip_other2(id);
       d3.selectAll("#"+id+"")
       .style("fill", "rgba(123,50,148, 1)");
     })
     .on('mouseout', function(d) {
       tip_extr.hide()
       removeTipOther2()
       id = this.id
       d3.selectAll("#"+id+"")
       .style("fill", "rgba(150,150,150, 1)");
     });

  // activating the tooltip
  svg.call(tip_extr);

  // appending title
  svg.append("text")
     .attr("id", "bar_extr_tot_title")
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
function tip_other(id) {
  data_refined = totDimsExtr.data_refined;
  for (var i = 0; i < data_refined.length; i++) {
    if (data_refined[i][0] == id) {
      data = data_refined[i][1]
    }
  }
  // set x location, can be determined using the id
  x_pre = month.findIndex(function (element) {
    return element == id;
  })
  x = x_pre * (totDimsExtr.w / month.length)
  y = totDimsExtr.yScale(data)

  var poly = [{"x":x, "y":y},
              {"x":x - 4,"y":y - 7},
              {"x":x + 4,"y":y - 7}];

  var tip_extr =
  d3.selectAll("#month_total")
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
          // .attr("stroke-width",2)
          .attr("transform", "translate(" + 77  + ",0)");

  tip_extr.append("rect")
    .attr("x", x - 5)
    .attr("y", y - 70)
    .attr("height", 60)
    .attr("width", 155)
    .style("fill", "rgba(0, 0, 0, 0.6)")
  tip_extr.append("text")
    .attr("x", x)
    .attr("y", y - 50)
    .style("fill", "white")
    .style("font-size", "16px")
    .text(function() {
      return "Month: " + id + " ";
    });
    tip_extr.append("text")
      .attr("x", x)
      .attr("y", y - 25)
      .style("fill", "white")
      .style("font-size", "16px")
      .text(function() {
        return "Gas in M Nm^3: " +
               Math.round(data) + "";
      });
}
function removeTipOther() {
  d3.selectAll("#toolExtra")
    .remove()

}

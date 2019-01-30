// Stan Helsloot, 10762388

// Renders a histogram of the yearly gas extraction by NAM
var requestsMonthEarth = [d3.json("../../data/data_refined/stacked_tot.json")];

// for storage of global variables in update functions
var monthEarthDims = {};

var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
             "Oct", "Nov", "Dec"];

// main function for making monthly gas extraction histogram.
var totMonthEarth = function() {
  Promise.all(requestsMonthEarth)
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
  monthEarthDims.w = w;

  // creating a svg object and adding it to a specified element on the page
  var svg = d3.select("div#earthTotal")
              .append("svg")
              .attr("id", "earthTotalMonth")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // selecting the correct data
  data = data[0];
  var dataArray = [];
  // combine data into an array to be used for setting the yScale
  for (var i = 0; i < data.length; i++) {
     dataArray.push(data[i][1]);
  }
  monthEarthDims.dataRefined = data;

  // setting the yScale and saving it for use in update functions
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...dataArray)])
                 .range([h, margin.top]);
  monthEarthDims.yScale = yScale;

  // creating the bars for the histogram
  svg.append("g")
     .selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("id", function (d) {
       // setting id as the month for use in dual tooltip function
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
       // set the HTML part of the tooltip with year and data
       tip.html(function() {
         return "<strong>Month: </strong><span class='details'>" + d[0] +
                "<br></span>" +
                "<strong>Earthquakes: </strong><span class='details'>" +
                Math.round(d[1]) + "</span>";
       });
       tip.show();
       // select the id of the selected bar so both month total bars can be
       // highlighted
       var id = this.id;
       // span a banner at the other chart
       newBannerExtraction(id);
       // set colors of all bars with the same id
       d3.selectAll("#"+id+"")
       .style("fill", "rgba(123,50,148, 1)");
     })
     .on('mouseout', function(d) {
       // remove both tooltip banners and set back the colors
       removeNewBannerExtraction();
       tip.hide();
       var id = this.id;
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

// function for creating the dual tooltip
function newBannerEarth(id) {

  dataRefined = monthEarthDims.dataRefined;
  // select the correct data
  for (var i = 0; i < dataRefined.length; i++) {
    if (dataRefined[i][0] == id) {
      data = dataRefined[i][1];
    }
  }
  // find index which can be determined using the id
  var index = month.findIndex(function (element) {
    return element == id;
  });

  // setting the x and y positions of the new banner
  var x = index * (monthEarthDims.w / month.length);
  var y = monthEarthDims.yScale(data);
  // setting the dimentions for the polygon
  var poly = [{"x":x, "y":y},
              {"x":x - 4,"y":y - 7},
              {"x":x + 4,"y":y - 7}];

  // create a group for adding all new banner functionalities
  var tipExtra = d3.selectAll("#earthTotalMonth")
                   .append("g")
                   .attr("font-family", "sans-serif")
                   .attr("font-size", 10)
                   .attr("id", "toolExtra");

  // add polygon
  tipExtra.selectAll("polygon")
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

  // add the rectangle
  tipExtra.append("rect")
          .attr("x", x)
          .attr("y", y - 70)
          .attr("height", 60)
          .attr("width", 130)
          .style("fill", "rgba(0, 0, 0, 0.6)");

  // add the first line of text
  tipExtra.append("text")
          .attr("x", x + 5)
          .attr("y", y - 50)
          .style("fill", "white")
          .style("font-size", "16px")
          .text(function() {
            return "Month: " + id + " ";
          });
  // add the second line of text
  tipExtra.append("text")
          .attr("x", x + 5)
          .attr("y", y - 25)
          .style("fill", "white")
          .style("font-size", "16px")
          .text(function() {
            return "Earthquakes: " +
                   data + "";
          });
}

// function for removing the banner
function removeNewBannerEarth() {
  d3.selectAll("#toolExtra")
    .remove();

}

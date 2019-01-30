// Stan Helsloot, 10762388

// Renders a histogram of the yearly gas extraction by NAM
var requestBarExtr = [d3.json("../../data/data_refined/data_tot.json")];

// for storage of global variables in update functions
var monthExtrDims = {};

var gasYearInitial = 1971;
var gasYearFinal = 2019;

var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
             "Oct", "Nov", "Dec"];

// main function for making monthly gas extraction histogram.
var totMonthExtr = function() {
  Promise.all(requestBarExtr)
         .then(function(response) {
           var draw = barMakerTot(response);
         });
};

// creates the first histogram
function barMakerTot(data) {

  // tooltip of bar_month
  var tip = d3.tip()
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
  monthExtrDims.w = w;
  monthExtrDims.h = h;
  monthExtrDims.margin = margin;

  // creating a svg object and adding it to an specified element on the page
  var svg = d3.select("div#extractionTotal")
              .append("svg")
              .attr("id", "monthTotal")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // selecting the correct data and obtaining the keys
  data = data[0];
  var dataRefined = [];
  var keys = Object.keys(data);
  var extraction_data = [];
  // collect, process and save data of all months in arrays
  for (var i = 0; i < keys.length; i++) {
     // convert the numeric data to [data] billion m^3
     extraction_data.push(data[keys[i]] / 1e9);
     dataRefined.push([keys[i], data[keys[i]] / 1e9]);

  }
  monthExtrDims.dataRefined = dataRefined;

  // setting the yScale and saving it globally for use in update function
  var yScale = d3.scaleLinear()
                 .domain([0, Math.max(...extraction_data)])
                 .range([h, margin.top]);
  monthExtrDims.yScale = yScale;

  // setting the data
  data = dataRefined;

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
       // setting banner of currently selected bar
       tip.html(function() {
        return "<strong>Month: </strong><span class='details'>" + d[0] +
               "<br></span>" +
               "<strong>Gas in M Nm^3: </strong><span class='details'>" +
               Math.round(d[1]) + "</span>";
      });
      tip.show();
      // select the id of the selected bar so both month total bars can be
      // highlighted
      var id = this.id;
      // span banner at the other chart
      newBannerEarth(id);
      // color all selected elements
      d3.selectAll("#"+id+"")
        .style("fill", "rgba(123,50,148, 1)");
      })
     .on('mouseout', function(d) {
       // remove all banners and set back the colors
       tip.hide();
       removeNewBannerEarth();
       var id = this.id;
       d3.selectAll("#"+id+"")
       .style("fill", "rgba(150,150,150, 1)");
     });

  // activating the tooltip
  svg.call(tip);

  // appending title
  svg.append("text")
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

// function for making an extra banner
function newBannerExtraction(id) {
  // selecting the data
  dataRefined = monthExtrDims.dataRefined;
  for (var i = 0; i < dataRefined.length; i++) {
    if (dataRefined[i][0] == id) {
      data = dataRefined[i][1];
    }
  }

  // find index which can be determined using the id
  var index = month.findIndex(function (element) {
    return element == id;
  });

  // setting correct x and y positions of the new banner
  var x = index * (monthExtrDims.w / month.length);
  var y = monthExtrDims.yScale(data);
  // setting dimensions of the arrow
  var poly = [{"x":x, "y":y},
              {"x":x - 4,"y":y - 7},
              {"x":x + 4,"y":y - 7}];

  // creating group for adding the new banner
  var tipExtra = d3.selectAll("#monthTotal")
                   .append("g")
                   .attr("font-family", "sans-serif")
                   .attr("font-size", 10)
                   .attr("id", "toolExtra");

  // adding the arrow
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
          .attr("transform", "translate(" + 77  + ",0)");

  // adding a rectangle
  tipExtra.append("rect")
          .attr("x", x - 5)
          .attr("y", y - 70)
          .attr("height", 60)
          .attr("width", 155)
          .style("fill", "rgba(0, 0, 0, 0.6)");

  // adding line 1
  tipExtra.append("text")
          .attr("x", x)
          .attr("y", y - 50)
          .style("fill", "white")
          .style("font-size", "16px")
          .text(function() {
            return "Month: " + id + " ";
          });

  // adding line 2
  tipExtra.append("text")
          .attr("x", x)
          .attr("y", y - 25)
          .style("fill", "white")
          .style("font-size", "16px")
          .text(function() {
            return "Gas in M Nm^3: " +
                   Math.round(data) + "";
          });
}

// function for removing the extra banner
function removeNewBannerExtraction() {
  d3.selectAll("#toolExtra")
    .remove();
}

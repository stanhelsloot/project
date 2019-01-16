// makes a stacked barchart for total years n stuff
// Stan Helsloot, 10762388
var requests_stacked = [d3.json("stacked_data.json")];

// stackedDims = {}

var stacked_year = function() {
  Promise.all(requests_stacked).then(function(response) {
    let draw = stackedMakerYear(response)
  })

}

// creates a histogram :)
function stackedMakerYear(data) {
  // tooltip of stacked_year
  var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([- 100, 0]);
  // size margin etc.
  var w = 600;
  var h = 400;
  var margin = {top: 80, right: 50, bottom: 20, left: 50}

  // creating a svg object
  var svg = d3.select("body")

              .append("svg")
              .attr("id", "stacked_year")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  range_data = []
  for (var i = 0; i < data[0].length; i++) {
    len = (data[0][i][0][1] + data[0][i][1][1] + data[0][i][2][1] +data[0][i][3][1])
    range_data.push(len)
  }

  // setting the y-scale
  var yScale = d3.scaleLinear()
                .domain([0, Math.max(...range_data)])
                .range([h, margin.top]);

  // const div = d3.select('body')
  //               .append('div')
  //               .attr('class', 'tooltip')
  //               .style('opacity', 0);

  // var stack = d3.stack()
color = {"1.5": "rgb(255, 0, 0)", "2.0": "rgb(0, 0, 255)", "2.5": "rgb(0, 255, 0)", "3.0": "rgb(0, 0, 0)" }

  var groups = svg.append("g")
    .selectAll("g")
    .data(data[0])
    .enter().append("g")

  groups.selectAll("rect")
    .data(function (d) {
      return d
    })
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return (d[0] - 1985) * (w / data[0].length )
     })
    .attr("y", function (d) {
      return  yScale(d[3])
    })
    .attr("height", function (d) {
      return h - yScale(d[1])
    })
    .attr("width", w / data[0].length)
    .style("fill", function (d) {
      return (color[d[2]]);
    })
    .attr("transform", "translate(" + 30 + ",0)")
    .on('mouseover',function(d){
      // make a banner with the location and magnitude of the earthquake
      tip.html(function () {
       return "<strong>Year: </strong><span class='details'>"+ d[0] +"<br></span>" + "<strong>Magnitude: </strong><span class='details'>"+ d[2] +"</span>"})
      tip.show();
      d3.select(this)
        .style("opacity", 0.3)
     })
    .on('mouseout', function(d){
      tip.hide();
      d3.select(this)
        .style("opacity", 1)
      });
svg.call(tip);


    // appending title
    svg.append("text")
         .attr("x", w / 2)
         .attr("class", "title")
         .attr("y", margin.top / 2)
         .style("text-anchor", "middle")
         .text("Yearly total of gas extacted, measured at standard conditions");

     var xScale = d3.scaleLinear()
                      .range([0, w])
                      .domain([1986, 2019]);

         // setting y axis
     var yAxis = d3.axisLeft()
                   .scale(yScale)
                   .ticks(5);

     // setting x xAxis
     var xAxis = d3.axisBottom()
                   .scale(xScale);

     svg.append("g")
          .attr("class", "yaxis")
          .attr("transform", "translate(" + margin.left + ",0)")
          .call(yAxis)
          .style("font-size", "12px");

       // appending axis
       svg.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(" + margin.left + "," + h + ")")
          .call(xAxis.tickFormat(d3.format(".4")))
          .style("font-size", "12px");

       // append xAxis text
       svg.append("text")
           .attr("transform", "translate(" + (w/2) + " ," +
                              (h + margin.top) + ")")
           .style("text-anchor", "middle")
           .text("Year")
           .style("font-size", "17px");

       // Append yAxis text
       svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", - h/2 + 30)
          .attr("y", margin.left / 2)
          .style("text-anchor", "middle")
          .text("Amount of earthquakes")
          .style("font-size", "17px");

      svg.append("g")
         .attr("class", "legend")
         .append("rect")
         .attr("x", 100)
         .attr("y", 100)
         .attr("width", 100)
         .attr("h")

  };

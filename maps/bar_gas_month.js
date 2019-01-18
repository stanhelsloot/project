// Stan Helsloot, 10762388
// Renders a histogram of the yearly gas extraction by NAM

var requests_bar_month = [d3.json("data_months.json")]

barDims = {}
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

var bar_month = function() {
  Promise.all(requests_bar_month).then(function(response) {
    let draw = barMakerMonth(response)

  })

}

// creates a histogram :)
function barMakerMonth(data) {
  // tooltip of bar_month
  var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([- 100, 0]);
  // size margin etc.
  var w = 400;
  var h = 300;
  var margin = {top: 80, right: 50, bottom: 20, left: 50}
  barDims.w = w
  barDims.h = h
  barDims.margin = margin

  // creating a svg object
  var svg = d3.select("div#extraction_month")

              .append("svg")
              .attr("id", "month")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);
  barDims.svg = svg

  // converting data into two different arrays

  data = data[0]

  extraction_data = []
  keys = Object.keys(data)

  // first display 2018 as standardiced year and make data of all years
  for (var j = 1971; j < 2019; j++) {
    data_refined = []
    temp = []
    for (i = 0; i < keys.length; i++){
      if (parseInt(keys[i]) == j){
        temp.push(keys[i])
        data_refined.push([month[i % 12], data[keys[i]]/1e9])
      }
      barDims[j] = data_refined
    }
  }

  for (i = 0; i < barDims[2018].length; i ++){

    extraction_data.push(barDims[2018][i][1])
  }
  data = data_refined
  // setting the y-scale
  var yScale = d3.scaleLinear()
                .domain([0, Math.max(...extraction_data)])
                .range([h, margin.top]);

    // creating the bars for the bargraph
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
        .on('mouseover',function(d){
          // make a banner with the location and magnitude of the earthquake
          tip.html(function () {
           return "<strong>Month: </strong><span class='details'>"+ d[0] +"<br></span>" + "<strong>Gas in billion Nm^3: </strong><span class='details'>"+ Math.round(d[1] * 100) / 100+"</span>"})
          tip.show();
          d3.select(this)
            .style("fill", "rgba(123,50,148, 1)")
         })
        .on('mouseout', function(d){
          tip.hide();
          d3.select(this)
            .style("fill", "rgba(150,150,150, 1)")
          });
    svg.call(tip)
    // appending title
    svg.append("text")
         .attr("x", w / 2)
         .attr("id", "bar_month_title")
         .attr("class", "title")
         .attr("y", margin.top / 2)
         .style("text-anchor", "middle")
         .text("Monthly total of gas extracted in 2018");
    for (i = 0; i < keys.length; i ++){
      keys[i] = parseFloat(keys[i])
    }

     var xScale = d3.scaleBand()
                      .rangeRound([0, w])
                      .padding(0.1)
                      .domain(month);

         // setting y axis
     var yAxis = d3.axisLeft()
                   .scale(yScale)
                   .ticks(5);

     // setting x xAxis
     var xAxis = d3.axisBottom()
                   .scale(xScale);

     svg.append("g")
          .attr("class", "yaxis")
          .attr("id", "month_y")
          .attr("transform", "translate(" + margin.left + ",0)")
          .call(yAxis);

       // appending axis
       svg.append("g")
          .attr("class", "xaxis")
          .attr("id", "month_x")
          .attr("transform", "translate(" + margin.left + "," + h + ")")
          .call(xAxis);

       // append xAxis text
       svg.append("text")
           .attr("transform", "translate(" + (w/2) + " ," +
                              (h + margin.top / 1.5) + ")")
           .style("text-anchor", "start")
           .text("Month");

           // Append yAxis text
           svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("x", - h/2 + 30)
              .attr("y", margin.left / 3)
              .style("text-anchor", "end")
              .text("Gas extraction in Nm^3")
  };

function convertData(data) {
  // converts the dict format to an array
  data = data[0]
  data_refined = []

  keys = Object.keys(data)
  for (i = 0; i < keys.length; i ++){
    data_refined.push([keys[i], data[keys[i]]])
    extraction_data.push(data[keys[i]])
  }
  return data_refined
}

function set_year(year) {
  // select title
  d3.selectAll("#bar_month_title")
    .text("Monthly total of gas extracted in " + year + "");
  // select
  svg = d3.selectAll("#month")
  data = barDims[year]
  extraction_data = []
  for (i = 0; i < data.length; i ++){
    // data_refined.push([keys[i], data[keys[i]]])
    extraction_data.push(data[i][1])
  }

  // setting the y-scale
  var yScale = d3.scaleLinear()
                .domain([0, Math.max(...extraction_data)])
                .range([barDims.h, barDims.margin.top]);

  // changing the rectangles to fit the new data, making sure to input the data
  // as data
  rect = svg.selectAll("#rect")
     .data(data)
     .transition()
     .duration(750)

     .attr("height", function (d) {
       return barDims.h - yScale(d[1])
     })
     .attr("y", function(d) {
       return yScale(d[1]);
     });

  // updating x and y scale accordingly
  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

  d3.selectAll("#month_y")
    .call(yAxis)
}

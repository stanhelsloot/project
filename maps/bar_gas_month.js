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
  // size margin etc.
  var w = 600;
  var h = 400;
  var margin = {top: 80, right: 50, bottom: 20, left: 50}
  barDims.w = w
  barDims.h = h
  barDims.margin = margin

  // creating a svg object
  var svg = d3.select("body")

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
        data_refined.push([month[i], data[keys[i]]/1e9])
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

  const div = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

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
          // console.log(yScale(d[1]))
          return yScale(d[1]);
        })
        .attr("height", function(d) {
          // console.log(h - yScale(d[1]))
          return h - yScale(d[1]);
        })
        .on('mouseover', d => {
            div.transition()
             .duration(100)
             .style('opacity', 0.9);
            div.html(Math.round(d[1] * 100) / 100)
             .style('left', d3.event.pageX + "px")
             .style('top', d3.event.pageY - 20 + "px");
        })
        .on('mouseout', () => {
            div
            .transition()
            .duration(500)
            .style('opacity', 0);
        });
// console.log(rect);
    // appending axii

    // appending title
    svg.append("text")
         .attr("x", w / 2)
         .attr("class", "title")
         .attr("y", margin.top / 2)
         .style("text-anchor", "middle")
         .text("Yearly total of gas extacted, measured at standard conditions");
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
          .call(yAxis)
          .style("font-size", "12px");

       // appending axis
       svg.append("g")
          .attr("class", "xaxis")
          .attr("id", "month_x")
          .attr("transform", "translate(" + margin.left + "," + h + ")")
          .call(xAxis)
          .style("font-size", "12px");

       // append xAxis text
       svg.append("text")
           .attr("transform", "translate(" + (w/2) + " ," +
                              (h + margin.top) + ")")
           .style("text-anchor", "middle")
           .text("Month")
           .style("font-size", "17px");

       // Append yAxis text
       svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", - h/2 + 30)
          .attr("y", margin.left / 2)
          .style("text-anchor", "middle")
          .text("Average BMI")
          .style("font-size", "17px");
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
  // select
  svg = d3.selectAll("#month")
  // console.log(svg);
  data = barDims[year]
  // console.log(data);
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

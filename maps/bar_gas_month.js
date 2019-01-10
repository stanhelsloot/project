// Stan Helsloot, 10762388
// Renders a histogram of the yearly gas extraction by NAM
var requests = [d3.json("data_months.json")]

window.onload = function() {
  Promise.all(requests).then(function(response) {
    let draw = barMaker(response)

  })

}

// creates a histogram :)
function barMaker(data) {
  console.log(data)
  // size margin etc.
  var w = 600;
  var h = 400;
  var margin = {top: 80, right: 50, bottom: 20, left: 50}

  // creating a svg object
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // converting data into two different arrays

  data = data[0]
  data_refined = []
  extraction_data = []
  keys = Object.keys(data)
  for (i = 0; i < keys.length; i ++){
    // j = "" + i
    // j = data[i]
    // j = (j/1e9)
    // console.log(j )
    data_refined.push([keys[i], data[keys[i]]])
    extraction_data.push(data[keys[i]])
  }
  data = data_refined
  console.log(extraction_data)
  // setting the y-scale
  var yScale = d3.scaleLinear()
                .domain([Math.min(...extraction_data), Math.max(...extraction_data)])
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

    // appending axii

    // appending title
    svg.append("text")
         .attr("x", w / 2)
         .attr("class", "title")
         .attr("y", margin.top / 2)
         .style("text-anchor", "middle")
         .text("Yearly total of gas extacted, measured at standard conditions");

     var xScale = d3.scaleLinear()
                      .range([0, w])
                      .domain([1971, 2018]);

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
          .text("Average BMI")
          .style("font-size", "17px");
  };

function convertData(data) {
  // converts the dict format to an array
  data = data[0]
  data_refined = []

  keys = Object.keys(data)
  for (i = 0; i < keys.length; i ++){
    // j = "" + i
    // j = data[i]
    // j = (j/1e9)
    // console.log(j )
    data_refined.push([keys[i], data[keys[i]]])
    extraction_data.push(data[keys[i]])
  }
  return data_refined
}

// makes a stacked barchart for total years n stuff
// Stan Helsloot, 10762388
var requests_stacked = [d3.json("data.json")];

var stacked_year = function() {
  Promise.all(requests_stacked).then(function(response) {
    let draw = stackedMakerYear(response)
  })

}

// creates a histogram :)
function stackedMakerYear(data) {
  data = data[0].data
  console.log(data);
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

  // converting data into two different arrays
  extraction_data = []
  for (i = 1971; i < 2019; i ++){
    // if (!(isNaN(data[- 1963 + i][1]))){
    extraction_data.push(data[- 1971 + i][4])
    // }

  }
  console.log(extraction_data);
  // setting the y-scale
  var yScale = d3.scaleLinear()
                .domain([Math.min(...extraction_data), Math.max(...extraction_data)])
                .range([h, margin.top]);

  // const div = d3.select('body')
  //               .append('div')
  //               .attr('class', 'tooltip')
  //               .style('opacity', 0);

  var stack = d3.stack()

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == year){
      if (data[4] ) {

      }
    }
  }

  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      // .attr("fill", (d, i) => color(data.keys[i]))
    .selectAll("rect")
    .data(function (d) {
      return d[4]
    })
    .enter().append("rect")
      .attr("x", function (d) {
        return d[0]
      }
      .attr("y", function (d) {
        return yScale(d[4])
      })
      .attr("height", function (d) {
        return yScale(d[4])
      })
      .attr("width", w/years.length);


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
        });
        // .on('mouseover', d => {
        //     div.transition()
        //      .duration(100)
        //      .style('opacity', 0.9);
        //     div.html(Math.round(d[1] * 100) / 100)
        //      .style('left', d3.event.pageX + "px")
        //      .style('top', d3.event.pageY - 20 + "px");
        // })
        // .on('mouseout', () => {
        //     div
        //     .transition()
        //     .duration(500)
        //     .style('opacity', 0);
        // })
        // .on("click", function (d) {
        //   set_year(d[0])
        //   set_map(d[0])
        // });

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
                      .domain([1971, 2019]);

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

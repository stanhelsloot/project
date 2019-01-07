var requests = [d3.json("geoData.geojson"), [d3.json("data.json")]];


window.onload = function() {
  Promise.all(requests).then(function(response) {
    let draw = worldMaker(response)

  })

}

function worldMaker(data) {

  console.log(data)
  // set width, height, padding and margins
  var w = 1300;
  var h = 600;
  var padding = 30;
  var margin = {top: 80, right: 120, bottom: 20, left: 50}

  // create svg canvas
  var svg = d3.select("body")
              .append("svg")
              .attr("id", 1)
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // create projection
  var projection = d3.geoMercator()
                     .scale(5400)
                     .translate( [w / 10, h / 0.1]);

  // create path
  var path = d3.geoPath().projection(projection);

  // append title of worldmap
  svg.append("text")
    .attr("x", w / 2)
    .attr("class", "title")
    .attr("y", margin.top / 3)
    .style("text-anchor", "middle")
    .text("AAH EARTHQUAKES");

  // draw provinces (note that Friesland has absorbed the Ijselmeer)
  svg.append("g")
     .attr("class", "countries")
     .selectAll("path")
     .data(data[0].features)
     .enter()
     .append("path")
     .attr("d", path)
     .style("stroke", "white")
     .style("stroke-width", 0.3)
     .attr("transform", "translate(0, " + margin.top + ")")
     .style("fill", "rgb(80, 0, 0)")
     .style("opacity", 0.8)
     .style("stroke","white")
     .style('stroke-width', 1);
}

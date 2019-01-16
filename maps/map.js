// Stan Helsloot, 10762388
// renders a map of the Netherlands

var requests_map = [d3.json("nederland.json"), d3.json("data.json")];
mapDims = {}

var map = function() {
  Promise.all(requests_map).then(function(response) {
    let draw = worldMaker(response)

  })

}
function worldMaker(data) {
  // tooltip of map
  var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0]);

  // set width, height, padding and margins
  var w = 400;
  var h = 600;
  var padding = 30;
  var margin = {top: 80, right: 120, bottom: 20, left: 50}
  mapDims.margin = margin

  // create svg canvas
  var svg = d3.select("body")
              .append("svg")
              .attr("id", "map")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // create projection
  var projection = d3.geoMercator()
                     .scale(11350)
                     .translate( [-900 , h * 21]);
  mapDims.projection = projection

  // create path
  var path = d3.geoPath().projection(projection);

  // append title of worldmap
  svg.append("text")
    .attr("x", w / 2)
    .attr("class", "title")
    .attr("y", margin.top / 3)
    .style("text-anchor", "middle")
    .text("AAH EARTHQUAKES");

  // draw provinces
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
     .style("fill", "rgba(80, 0, 0, 0.5)")
     .style("opacity", 0.8)
     .style("stroke","white")
     .style('stroke-width', 1);

  data = data[1].data
  // select data based on year
  for (var year = 1986; year < 2019; year++) {
    data_refined = []
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] == year){
        data_refined.push(data[i])
      }
      mapDims[year] = data_refined
    }
  }

  data = data_refined

  // draw circles based on the year, changed with updatefunction
  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function (d) {
       return projection([d[2], 5])[0]
     })
     .attr("cy", function (d) {
       return projection([5, d[3]])[1]
     })
     .attr("r", function (d) {
       return d[4] * 8
     })
     .style("fill", "rgba(255, 255, 0, 0.3)")
     .attr("transform", "translate(0, " + margin.top + ")")
     .on('mouseover',function(d){
       // make a banner with the location and magnitude of the earthquake
       tip.html(function () {
        return "<strong>Location: </strong><span class='details'>"+ d[1] +"<br></span>" + "<strong>Magnitude: </strong><span class='details'>"+ Math.round(d[4] * 100) / 100 +"</span>"+ "<strong>Date: </strong><span class='details'>" + d[5] + "</span>";       })
       tip.show();
       d3.select(this)
         .style("fill", "rgba(180, 0, 0, 0.6)")
      })
     .on('mouseout', function(d){
       tip.hide();
       d3.select(this)
         .style("fill", "rgba(255, 255, 0, 0.3)")
       });

       // activate tip
     svg.call(tip);

}

function set_map(year) {
  // make tip again so it works on the new circles
  var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0]);

  svg = d3.selectAll("#map")
  var circle = svg.selectAll("circle");
  circle.transition().duration(500).attr("r", 0).remove();
  var data = mapDims[year];
  setTimeout(function () {
    newCircle(data, year)
  }, 1000);

  function newCircle(data, year) {
    if (Object.keys(mapDims).includes(String(year))){
      projection = mapDims.projection;
      var circle = svg.selectAll("circle")
         .data(mapDims[year])
         .enter()
         .append("circle")
         .attr("cx", function (d) {
           return projection([d[2], 5])[0]
         })
         .attr("cy", function (d) {
           return projection([5, d[3]])[1]
         })
         .attr("r", function (d) {
           return 0
         })
         .style("fill", "rgba(255, 255, 0, 0.3)")
          .attr("transform", "translate(0, " + mapDims.margin.top + ")")
          .on('mouseover',function(d){
            // make a banner with the location and magnitude of the earthquake
            tip.html(function () {
              return "<strong>Location: </strong><span class='details'>"+ d[1] +"<br></span>" + "<strong>Magnitude: </strong><span class='details'>"+ Math.round(d[4] * 100) / 100 +"</span>"+ "<strong>Date: </strong><span class='details'>" + d[5] + "</span>";
            })
            tip.show(d);
            d3.select(this)
              .style("fill", "rgba(180, 0, 0, 0.6)")
           })
          .on('mouseout', function(d){
            tip.hide(d);
            d3.select(this)
              .style("fill", "rgba(255, 255, 0, 0.3)")
            });
svg.call(tip);
      circle.transition().duration(500).attr("r", function (d) {
        return d[4]*8
      })

    }

  }



}

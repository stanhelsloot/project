// Stan Helsloot, 10762388
// renders a map of the Netherlands with earthquakes as circles
var requests_map = [d3.json("../../data/data_refined/nederland.json"), d3.json(
                    "../../data/data_refined/data.json")];

var mapDims = {};

var earthquakeYearInitial = 1986;
var earthquakeYearFinal = 2019;

// main function for creating the map
var map = function() {
  Promise.all(requests_map)
         .then(function(response) {
           var draw = worldMaker(response);
         });
};

// creates a worldmap and plots earthquakes of 2018 on it.
function worldMaker(data) {
  // tooltip of map
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0]);
  mapDims.tip = tip;
  // set width, height, padding and margins
  var w = 300;
  var h = 300;
  var padding = 30;
  var margin = {
    top: 100,
    right: 50,
    bottom: 20,
    left: 50
  };
  mapDims.margin = margin;

  // create svg canvas
  var svg = d3.select("div#earthquake_map")
              .append("svg")
              .attr("id", "map")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom);

  // create projection and save it globally
  var projection = d3.geoMercator()
                     .scale(8500)
                     .center([5.953193, 52.793096])
                     .translate([w / 1.4, h / 2]);
  mapDims.projection = projection;

  // create path
  var path = d3.geoPath()
               .projection(projection);

  // append title of worldmap
  svg.append("text")
     .attr("class", "title")
     .attr("id", "mapTitle")
     .attr("y", margin.top / 6)
     .style("text-anchor", "center")
     .text("Earthquakes throughout the Netherlands in 2018");

  // draw provinces
  svg.append("g")
     .attr("class", "provinces")
     .selectAll("path")
     .data(data[0].features)
     .enter()
     .append("path")
     .attr("d", path)
     .style("stroke", "white")
     .style("stroke-width", 0.5)
     .attr("transform", "translate(0, " + margin.top + ")")
     .style("fill", "rgba(204,204,204, 1)")
     .style("opacity", 0.8)
     .style("stroke", "white")
     .style('stroke-width', 1);

  data = data[1].data;

  // select data based on year and save it in mapDims
  var data_refined = [];
  for (var year = earthquakeYearInitial; year < earthquakeYearFinal; year++) {
    data_refined = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] == year) {
        data_refined.push(data[i]);
      }
      mapDims[year] = data_refined;
    }
  }
  data = data_refined;

  // draw circles based on the year, changed with updatefunction
  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return projection([d[2], 5])[0];
     })
     .attr("cy", function(d) {
       return projection([5, d[3]])[1];
     })
     .attr("r", function(d) {
       return d[4] * 8;
     })
     .style("fill", "rgba(0,109,44, 0.5)")
     .attr("transform", "translate(0, " + margin.top + ")")
     .on('mouseover', function(d) {
       // make a banner with the location and magnitude of the earthquake
       tip.html(function() {
         return "<strong>Location: </strong><span class='details'>" + d[
             1] + "<br></span>" +
           "<strong>Magnitude: </strong><span class='details'>" + Math.round(
             d[4] * 100) / 100 + "</span>" +
           "<br><strong>Date: </strong><span class='details'>" + d[5] +
           "</span>";
       });
       tip.show();
       d3.select(this)
         .style("fill", "rgba(123,50,148, 0.6)");
     })
     .on('mouseout', function(d) {
       tip.hide();
       d3.select(this)
         .style("fill", "rgba(0,109,44, 0.5)");
     });

  // activate tip
  svg.call(tip);

  // save the year as a global variable for usage in magnitude selection
  mapDims.year = 2018;
}

function set_map(year) {
  // save the year as a global variable for usage in magnitude selection
  mapDims.year = year;

    // update title name
  d3.selectAll("#mapTitle")
    .text("Earthquakes throughout the Netherlands in " + year + "");

  // make tip again so it works on the new circles
  var tip = mapDims.tip;

  // select the correct svg file
  var svg = d3.selectAll("#map");

  // remove the richter scale banner
  svg.selectAll("#richter")
     .remove();

  // remove circles with transition
  var circle = svg.selectAll("circle");
  circle.transition()
    .duration(500)
    .attr("r", 0)
    .remove();

  // select choosen data
  var data = mapDims[year];

  // wait function due to removing with transition
  setTimeout(function() {
    newCircle(data, year);
  }, 1000);

  // function for creating new circles based on the selected year
  function newCircle(data, year) {
    if (Object.keys(mapDims)
              .includes(String(year))) {
                projection = mapDims.projection;
                var circle = svg.selectAll("circle")
                .data(mapDims[year])
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                  return projection([d[2], 5])[0];
                })
                .attr("cy", function(d) {
                  return projection([5, d[3]])[1];
                })
                .attr("r", function(d) {
                  // setting radius on 0 so can do a transition later
                  return 0;
                })
                .style("fill", "rgba(0,109,44, 0.5)")
                .attr("transform", "translate(0, " + mapDims.margin.top + ")")
                .on('mouseover', function(d) {
                  // make a banner with location and magnitude of the earthquake
                  tip.html(function() {
                    return "<strong>Location: </strong><span class='details'>" +
                    d[1] + "<br></span>" +
                    "<strong>Magnitude: </strong><span class='details'>" +
                    Math.round(d[4] * 100) / 100 + "<br></span>" +
                    "<strong>Date: </strong><span class='details'>" + d[5] +
                    "</span>";
                  });
                  tip.show(d);
                  d3.select(this)
                    .style("fill", "rgba(123,50,148, 0.6)");
                })
                .on('mouseout', function(d) {
                  tip.hide(d);
                  d3.select(this)
                    .style("fill", "rgba(0,109,44, 0.5)");
                });
                svg.call(tip);
                circle.transition()
                .duration(500)
                .attr("r", function(d) {
                  return d[4] * 8;
                });
              }
    }
}

// function for drawing circles in choosen range
function set_map_mag_range(range) {
  // select year on current mapDims.year variable
  var year = mapDims.year;

  // select the correct data of the range
  var data_refined = [];
  for (var i = 0; i < mapDims[year].length; i++) {
    if (mapDims[year][i][4] > parseFloat(range) && mapDims[year][i][4] < (
        parseFloat(range) + 0.5)) {
      data_refined.push(mapDims[year][i]);
    }
  }
  data = data_refined;

  // make tip again so it works on the new circles
  var tip = mapDims.tip;

  // update "richter banner"
  svg = d3.selectAll("#map");
  svg.selectAll("#richter")
     .remove();

  svg.append("text")
     .attr("id", "richter")
     .attr("y", mapDims.margin.top / 2.5)
     .style("text-anchor", "center")
     .text("between " + range + " and " + (parseFloat(range) + 0.5) +
       " on the Richter scale");

  // remove circles
  var circle = svg.selectAll("circle")
                  .transition()
                  .duration(500)
                  .attr("r", 0)
                  .remove();

  // wait function to prevent removal of newer circles
  setTimeout(function() {
    newCircle(data, year);
  }, 1000);

  // function for creating new circles based on the selected year
  function newCircle(data, year) {
    if (Object.keys(mapDims)
              .includes(String(year))) {
                projection = mapDims.projection;
                var circle = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                  return projection([d[2], 5])[0];
                })
                .attr("cy", function(d) {
                  return projection([5, d[3]])[1];
                })
                .attr("r", function(d) {
                  return 0;
                })
                .style("fill", "rgba(0,109,44, 0.5)")
                .attr("transform", "translate(0, " + mapDims.margin.top + ")")
                .on('mouseover', function(d) {
                  // make a banner with location and magnitude of the earthquake
                  tip.html(function() {
                    return "<strong>Location: </strong><span class='details'>" +
                    d[1] + "<br></span>" +
                    "<strong>Magnitude: </strong><span class='details'>" +
                    Math.round(d[4] * 100) / 100 + "<br></span>" +
                    "<strong>Date: </strong><span class='details'>" + d[5] +
                    "</span>";
                  });
                  tip.show(d);
                  d3.select(this)
                    .style("fill", "rgba(123,50,148, 0.6)");
                  })
                  .on('mouseout', function(d) {
                    tip.hide(d);
                    d3.select(this)
                      .style("fill", "rgba(10,109,44, 0.5)");
                    });
                    svg.call(tip);
                    circle.transition()
                    .duration(500)
                    .attr("r", function(d) {
                      return d[4] * 8;
                    });
                  }
    }
}

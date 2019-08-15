

var salesData;
var truncLengh = 30;

// document.addEventListener("DOMContentLoaded", function () {
//   Plot()
// });

function Plot() {
  TransformChartData(chartData, chartOptions);
  BuildPie("chart", chartData, chartOptions);
}

function BuildPie(id, chartData, options) {
  var xVarName;
  var divisionRatio = 2.5;
  var legendoffset = 0;

  chart = d3.select("#" + id + " .innerCont");

  var yVarName = options[0].yaxis;
  width = 900,
  height = 900,
  radius = Math.min(width, height) / divisionRatio;

  xVarName = options[0].xaxis;

  var rcolor = d3.scaleOrdinal().range(runningColors);

  arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 300);

  chart = chart
    .append("svg")  //append svg element inside #chart
    .attr("width", width)    //set width
    .attr("height", height)  //set height
    .append("g")
    .attr("transform", "translate(" + (width / divisionRatio) + "," + ((height / divisionRatio) + 30) + ")");

  var pie = d3.pie()
    .sort(null)
    .value(function (d) {
      return 1;
    });

  var g = chart.selectAll(".arc")
    .data(pie(runningData))
    .enter().append("g")
    .attr("class", "arc");

  var count = 0;

  var path = g.append("path")
    .attr("d", arc)
    .attr("id", function (d) { return "arc-" + (count++); })
    .style("opacity", function (d) {
      return d.data["op"];
    });

  path.append("svg:title")
    .text(function (d) {
      return d.data["title"] + " (" + d.data[yVarName] + ")";
    });

  path.style("fill", function (d) {
    return rcolor(d.data[xVarName]);
  })

  g.append("text")
  .style("font-size", "13")
    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("opacity", 1)
    .text(function (d) {
      return d.data.category;
    });

  count = 0;

  var legend = chart.selectAll(".legend")
    .data(runningData).enter()
    .append("g").attr("class", "legend")
    .attr("legend-id", function (d) {
      return count++;
    })
    .attr("transform", function (d, i) {
      return "translate(15," + (parseInt("-" + (runningData.length * 10)) + i * 28 + legendoffset) + ")";
    })
    .style("cursor", "pointer")

  var leg = legend.append("rect");

  leg.attr("x", width / 2)
    .attr("width", 18).attr("height", 18)
    .style("fill", function (d) {
      return rcolor(d[yVarName]);
    })
  legend.append("text").attr("x", (width / 2) - 5)
    .attr("y", 9).attr("dy", ".35em")
    .style("text-anchor", "end").text(function (d) {
      return d.caption;
    });
    
  leg.append("svg:title")
    .text(function (d) {
      return d["title"] + " (" + d[yVarName] + ")";
    });

  var defs = svg.append("defs");

  //Filter for the outside glow
  var filter = defs.append("filter")
    .attr("id", "glow");
  filter.append("feGaussianBlur")
    .attr("stdDeviation", "3.5")
    .attr("result", "coloredBlur");
  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
    .attr("in", "coloredBlur");
  feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

  d3.selectAll(".arc")
    .style("filter", "url(#glow)");
}

function TransformChartData(chartData, opts) {
  var result = [];
  var resultColors = [];
  var counter = 0;
  var hasMatch;
  var xVarName;
  var yVarName = opts[0].yaxis;
  xVarName = opts[0].xaxis;

  for (var i in chartData) {
    hasMatch = false;
    for (var index = 0; index < result.length; ++index) {
      var data = result[index];
      if (data[xVarName] == chartData[i][xVarName]) {
        result[index][yVarName] = result[index][yVarName] + chartData[i][yVarName];
        hasMatch = true;
        break;
      }
    }
    if (hasMatch == false) {
      ditem = {};
      ditem[xVarName] = chartData[i][xVarName];
      ditem[yVarName] = chartData[i][yVarName];
      ditem["caption"] = opts[0].captions != undefined ? opts[0].captions[0][chartData[i][xVarName]] : "";
      ditem["title"] = opts[0].captions != undefined ? opts[0].captions[0][chartData[i][xVarName]] : "";
      result.push(ditem);
      resultColors[counter] = opts[0].color != undefined ? opts[0].color[0][chartData[i][xVarName]] : "";
      counter += 1;
    }
  }
  runningData = result;
  runningColors = resultColors;
  return;
}

var chartData = [
  { "category": "Semimajor Axis", "planet": "Mercury", "total": 57909227, "color": "#e7e8ec" },
  { "category": "Semimajor Axis", "planet": "Venus", "total": 108208475, "color": "#f4dca9" },
  { "category": "Semimajor Axis", "planet": "Earth", "total": 149598262, "color": "#739ac4" },
  { "category": "Semimajor Axis", "planet": "Mars", "total": 227943824, "color": "#ad0000" },
  { "category": "Semimajor Axis", "planet": "Jupiter", "total": 778340821, "color": "#a08e83" },
  { "category": "Semimajor Axis", "planet": "Saturn", "total": 1426666422, "color": "#f4a587" },
  { "category": "Semimajor Axis", "planet": "Uranus", "total": 2870658186, "color": "#b2b6c7" },
  { "category": "Semimajor Axis", "planet": "Neptune", "total": 4498396441, "color": "#3f53ba" },

  { "category": "Perihelion", "planet": "Mercury", "total": 46001200, "color": "#e7e8ec" },
  { "category": "Perihelion", "planet": "Venus", "total": 107477000, "color": "#f4dca9" },
  { "category": "Perihelion", "planet": "Earth", "total": 147095000, "color": "#739ac4" },
  { "category": "Perihelion", "planet": "Mars", "total": 206700000, "color": "#ad0000" },
  { "category": "Perihelion", "planet": "Jupiter", "total": 740379835, "color": "#a08e83" },
  { "category": "Perihelion", "planet": "Saturn", "total": 1349823615, "color": "#f4a587" },
  { "category": "Perihelion", "planet": "Uranus", "total": 2147483647, "color": "#b2b6c7" },
  { "category": "Perihelion", "planet": "Neptune", "total": 2147483647, "color": "#3f53ba" },

  { "category": "Aphelion", "planet": "Mercury", "total": 69816900, "color": "#e7e8ec" },
  { "category": "Aphelion", "planet": "Venus", "total": 108939000, "color": "#f4dca9" },
  { "category": "Aphelion", "planet": "Earth", "total": 152100000, "color": "#739ac4" },
  { "category": "Aphelion", "planet": "Mars", "total": 249200000, "color": "#ad0000" },
  { "category": "Aphelion", "planet": "Jupiter", "total": 816620000, "color": "#a08e83" },
  { "category": "Aphelion", "planet": "Saturn", "total": 1503509229, "color": "#f4a587" },
  { "category": "Aphelion", "planet": "Uranus", "total": 2147483647, "color": "#b2b6c7" },
  { "category": "Aphelion", "planet": "Neptune", "total": 2147483647, "color": "#3f53ba" },

  { "category": "Eccentricity", "planet": "Mercury", "total": 0.2056, "color": "#e7e8ec" },
  { "category": "Eccentricity", "planet": "Venus", "total": 0.0067, "color": "#f4dca9" },
  { "category": "Eccentricity", "planet": "Earth", "total": 0.0167, "color": "#739ac4" },
  { "category": "Eccentricity", "planet": "Mars", "total": 0.0935, "color": "#ad0000" },
  { "category": "Eccentricity", "planet": "Jupiter", "total": 0.0489, "color": "#a08e83" },
  { "category": "Eccentricity", "planet": "Saturn", "total": 0.0565, "color": "#f4a587" },
  { "category": "Eccentricity", "planet": "Uranus", "total": 0.0457, "color": "#b2b6c7" },
  { "category": "Eccentricity", "planet": "Neptune", "total": 0.0113, "color": "#3f53ba" },

  { "category": "Inclination", "planet": "Mercury", "total": 7, "color": "#e7e8ec" },
  { "category": "Inclination", "planet": "Venus", "total": 3.39, "color": "#f4dca9" },
  { "category": "Inclination", "planet": "Earth", "total": 0, "color": "#739ac4" },
  { "category": "Inclination", "planet": "Mars", "total": 1.85, "color": "#ad0000" },
  { "category": "Inclination", "planet": "Jupiter", "total": 1.304, "color": "#a08e83" },
  { "category": "Inclination", "planet": "Saturn", "total": 2.485, "color": "#f4a587" },
  { "category": "Inclination", "planet": "Uranus", "total": 0.772, "color": "#b2b6c7" },
  { "category": "Inclination", "planet": "Neptune", "total": 1.769, "color": "#3f53ba" },

  { "category": "Density", "planet": "Mercury", "total": 5.4291, "color": "#e7e8ec" },
  { "category": "Density", "planet": "Venus", "total": 5.243, "color": "#f4dca9" },
  { "category": "Density", "planet": "Earth", "total": 5.5136, "color": "#739ac4" },
  { "category": "Density", "planet": "Mars", "total": 3.9341, "color": "#ad0000" },
  { "category": "Density", "planet": "Jupiter", "total": 1.3262, "color": "#a08e83" },
  { "category": "Density", "planet": "Saturn", "total": 0.6871, "color": "#f4a587" },
  { "category": "Density", "planet": "Uranus", "total": 1.27, "color": "#b2b6c7" },
  { "category": "Density", "planet": "Neptune", "total": 1.638, "color": "#3f53ba" },

  { "category": "Gravity", "planet": "Mercury", "total": 3.7, "color": "#e7e8ec" },
  { "category": "Gravity", "planet": "Venus", "total": 8.87, "color": "#f4dca9" },
  { "category": "Gravity", "planet": "Earth", "total": 9.8, "color": "#739ac4" },
  { "category": "Gravity", "planet": "Mars", "total": 3.71, "color": "#ad0000" },
  { "category": "Gravity", "planet": "Jupiter", "total": 24.79, "color": "#a08e83" },
  { "category": "Gravity", "planet": "Saturn", "total": 10.44, "color": "#f4a587" },
  { "category": "Gravity", "planet": "Uranus", "total": 8.87, "color": "#b2b6c7" },
  { "category": "Gravity", "planet": "Neptune", "total": 11.15, "color": "#3f53ba" },

  { "category": "Ellipticity", "planet": "Mercury", "total": 0, "color": "#e7e8ec" },
  { "category": "Ellipticity", "planet": "Venus", "total": 0, "color": "#f4dca9" },
  { "category": "Ellipticity", "planet": "Earth", "total": 0.00335, "color": "#739ac4" },
  { "category": "Ellipticity", "planet": "Mars", "total": 0.00589, "color": "#ad0000" },
  { "category": "Ellipticity", "planet": "Jupiter", "total": 0.06487, "color": "#a08e83" },
  { "category": "Ellipticity", "planet": "Saturn", "total": 0.09796, "color": "#f4a587" },
  { "category": "Ellipticity", "planet": "Uranus", "total": 0.02293, "color": "#b2b6c7" },
  { "category": "Ellipticity", "planet": "Neptune", "total": 0.01708, "color": "#3f53ba" },
]

chartOptions = [{
  "captions": [
    {
      "Semimajor Axis": "Semimajor Axis", "Perihelion": "Perihelion", "Aphelion": "Aphelion", "Eccentricity": "Eccentricity",
      "Inclination": "Inclination", "Density": "Density", "Gravity": "Gravity", "Ellipticity": "Ellipticity"
    }
  ],
  "color": [
    {
      "Semimajor Axis": "#e7e8ec", "Perihelion": "#f4dca9", "Aphelion": "#739ac4", "Eccentricity": "#ad0000",
      "Inclination": "#a08e83", "Density": "#f4a587", "Gravity": "#b2b6c7", "Ellipticity": "#3f53ba"
    }
  ],
  "xaxis": "category",
  "yaxis": "total"
}]

Plot();
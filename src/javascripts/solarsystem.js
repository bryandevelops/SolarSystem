var margin = { top: 100, right: 50, bottom: 100, left: 210 };

var width = 1500 
  height = 500 

var svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var starArea = d3.select("svg").append("g");

var config = {
  padding: 10,
  axisMultiplier: 1.3,
  velocity: [0.01, 0],
  starRadius: 1,
  glowRadius: 2
};

var solar = [
  { name: "Mercury", tilt: 0.03, radius: 32439.7, size: 2439.7, rotation: 10.83, period: 58.65, colours: ["#e7e8ec", "#b1adad"]},
  { name: "Venus", tilt: 2.64, radius: 36051.8, size: 6051.8, rotation: 6.52, period: -243, colours: ["#f8e2b0", "#d3a567"]},
  { name: "Earth", tilt: 23.44, radius: 36371, size: 6371, rotation: 1674, period: 1, colours: ["#9fc164", "#6b93d6"]},
  { name: "Mars", tilt: 6.68, radius: 33389.5, size: 3389.5, rotation: 866, period: 1.03, colours: ["#ef1501", "#ad0000"]},
  { name: "Jupiter", tilt: 25.19, radius: 69911, size: 69911, rotation: 45583, period: 0.41, colours: ["#d8ca9d", "	#a59186"]},
  { name: "Saturn", tilt: 26.73, radius: 58232, size: 58232, rotation: 36840, period: 0.44, colours: ["#f4d587", "#f4a587"]},
  { name: "Uranus", tilt: 82.23, radius: 45362, size: 25362, rotation: 14794, period: -0.72, colours: ["#e1eeee", "#adb0c3"]},
  { name: "Neptune", tilt: 28.32, radius: 44622, size: 24622, rotation: 9719, period: 0.72, colours: ["#85addb", "	#3f54ba"]}
];

var definitions = d3.select("svg").append("defs");
var filter = definitions.append("filter")
  .attr("id", "glow");
filter.append("feGaussianBlur")
  .attr("class", "blur")
  .attr("stdDeviation", config.glowRadius)
  .attr("result", "coloredBlur");
var feMerge = filter.append("feMerge")
feMerge.append("feMergeNode")
  .attr("in", "coloredBlur");
feMerge.append("feMergeNode")
  .attr("in", "SourceGraphic");

function generateStars(number) {
  var stars = starArea.selectAll("circle")
    .data(d3.range(number).map(d =>
      i = { x: Math.random() * 2100, y: Math.random() * 2100, r: Math.random() * 1 }
    ))
    .enter().append("circle")
    .attr("class", "star")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r);
}

function displayPlanets(cfg, planets) {
  var boundingSize = (width / planets.length) - cfg.padding;

  var boundingArea = svg.append("g")
    .selectAll("g")
    .data(planets)
    .enter().append("g")
    .attr("transform", (d, i) => "translate(" + [i * (boundingSize + cfg.padding), height / 2] + ")")
    .on("mouseover", showInfo)
    .on("mouseout", hideInfo);

  var boundingRect = boundingArea.append("rect")
    .attr("class", "bounding-box")
    .attr("y", -boundingSize / 2)
    .attr("width", boundingSize)
    .attr("height", boundingSize);

  var info = boundingArea.append("g")
    .attr("transform", "translate(" + [0, (boundingSize / 2) + 18] + ")")
    .attr("class", "info")
    .style("opacity", 0);
  info.append("text")
    .text(d => "Radius: " + d.size + "km");
  info.append("text")
    .attr("y", 15)
    .text(d => "Rotation: " + d.rotation + "km/h");
  info.append("text")
    .attr("y", 30)
    .text(d => "Tilt: " + d.tilt + "°");
  info.append("text")
    .attr("y", 45)
    .text(d => "Day Length: " + d.period);

  var labels = boundingArea.append("text")
    .attr("class", "label")
    .attr("y", -boundingSize / 2)
    .attr("dy", -12)
    .text(d => d.name);

  var radiusScale = d3.scaleLinear()
    .domain([0, d3.max(planets, d => d.radius)])
    .range([0, (boundingSize / 2) - 3]);

  var graticuleScale = d3.scaleLinear()
    .domain(d3.extent(planets, d => d.radius))
    .range([20, 10]);

  var planets = boundingArea.each(function (d) {
    var x = d3.select(this);
    drawPlanet(x, d);
  });

  function drawPlanet(element, data) {
    var rotation = [0, 0, data.tilt];

    var projection = d3.geoOrthographic()
      .translate([0, 0])
      .scale(radiusScale(data.radius))
      .clipAngle(90)
      .precision(0.1);

    var path = d3.geoPath()
      .projection(projection);

    var graticule = d3.geoGraticule();

    var planet = element.append("g")
      .attr("class", "planet")
      .attr("id", "planet")
      .attr("transform", "translate(" + [boundingSize / 2, 0] + ")");

    var defs = d3.select("svg").select("defs");

    var gradient = defs.append("radialGradient")
      .attr("id", "gradient" + data.name)
      .attr("cx", "25%")
      .attr("cy", "25%");

    gradient.append("stop")
      .attr("offset", "5%")
      .attr("stop-color", data.colours[0]);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", data.colours[1]);

    var axis = planet.append("line")
      .attr("class", "axis-line")
      .attr("x1", -radiusScale(data.radius) * cfg.axisMultiplier)
      .attr("x2", radiusScale(data.radius) * cfg.axisMultiplier)
      .attr("transform", "rotate(" + (90 - data.tilt) + ")");

    var fill = planet.append("circle")
      .attr("r", radiusScale(data.radius))
      .style("fill", "url(#gradient" + data.name + ")")
      .style("filter", "url(#glow)");

    var gridLines = planet.append("path")
      .attr("class", "graticule")
      .datum(graticule.step([graticuleScale(data.radius), graticuleScale(data.radius)]))
      .attr("d", path);

    d3.timer(function (elapsed) {
      projection.rotate([rotation[0] + elapsed * cfg.velocity[0] / data.period, rotation[1] + elapsed * cfg.velocity[1] / data.period, rotation[2]]);
      gridLines.attr("d", path);
    })
  }
}

function showInfo(d) {
  d3.select(this).select("g.info")
    .transition()
    .style("opacity", 1);
}

function hideInfo(d) {
  d3.select(this).select("g.info")
    .transition()
    .style("opacity", 0);
}

generateStars(1000);
displayPlanets(config, solar);
starArea.lower();

// 3D Solar System sourced from Cale Tilford's code under The MIT License.
// My own touches have been added such as increasing the size of the planets and adding
// more information such as the rotation speed, but the majority was found here:
// https://bl.ocks.org/tlfrd/155feca25ebe85b6f31b56945e912b4e


// const title = d3.select("svg").append("text")
//   .text("Solar System")
//   .attr("class", "title-name")
//   .attr("x", "50%")
//   .attr("y", 150)
//   .attr("text-anchor", "middle")

// document.getElementById("planet").addEventListener("click", function() {
//   console.log("clicked")
//   fetch('https://api.le-systeme-solaire.net/rest/bodies/terre?data=englishName,aphelion,perihelion,semimajorAxis,eccentricity,density,gravity,inclination')
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       let h1;
//       let text;

//       Object.entries(data).forEach(d => {
//         switch (d[0]) {
//           case "englishName":
//             h1 = document.createElement("h1");
//             text = document.createTextNode(d[1]);
//             h1.appendChild(text);
//             document.getElementById("more-info").appendChild(h1);
//             break;
//           case "semimajorAxis":
//             li = document.createElement("li");
//             text = document.createTextNode(`Semimajor Axis ${d[1]} km`);
//             li.appendChild(text);
//             document.getElementById("more-info").appendChild(li);
//             break;
//           case "perihelion":
//             li = document.createElement("li");
//             text = document.createTextNode(`Perihelion ${d[1]} km`);
//             li.appendChild(text);
//             document.getElementById("more-info").appendChild(li);
//             break;
//           case "aphelion":
//             li = document.createElement("li");
//             text = document.createTextNode(`Aphelion ${d[1]} km`);
//             li.appendChild(text);
//             document.getElementById("more-info").appendChild(li);
//             break;
//           case "eccentricity":
//             li = document.createElement("li");
//             text = document.createTextNode(`Eccentricity: ${d[1]}`);
//             li.appendChild(text);
//             document.getElementById("more-info").appendChild(li);
//             break;
//           case "inclination":
//             li = document.createElement("li");
//             text = document.createTextNode(`Orbital Inclination: ${d[1]}°`);
//             li.appendChild(text);
//             document.getElementById("more-info").appendChild(li);
//             break;
//           case "density":
//             li = document.createElement("li");
//             text = document.createTextNode(`Density: ${d[1]} g/cm³`);
//             li.appendChild(text);
//             document.getElementById("more-info").appendChild(li);
//             break;
//           case "gravity":
//             li = document.createElement("li");
//             text = document.createTextNode(`Gravity: ${d[1]} m/s²`);
//             li.appendChild(text);
//             document.getElementById("more-info").appendChild(li);
//             break;
//         }
//       })
//     });
// })

var elements = Array.from(document.querySelectorAll('.planet'));

elements.forEach(function(el) {
  el.addEventListener("click", () => {
    fetch('https://api.le-systeme-solaire.net/rest/bodies/terre?data=englishName,aphelion,perihelion,semimajorAxis,eccentricity,density,gravity,inclination')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let h1;
        let text;

        Object.entries(data).forEach(d => {
          switch (d[0]) {
            case "englishName":
              h1 = document.createElement("h1");
              text = document.createTextNode(d[1]);
              h1.appendChild(text);
              document.getElementById("more-info").appendChild(h1);
              break;
            case "semimajorAxis":
              li = document.createElement("li");
              text = document.createTextNode(`Semimajor Axis ${d[1]} km`);
              li.appendChild(text);
              document.getElementById("more-info").appendChild(li);
              break;
            case "perihelion":
              li = document.createElement("li");
              text = document.createTextNode(`Perihelion ${d[1]} km`);
              li.appendChild(text);
              document.getElementById("more-info").appendChild(li);
              break;
            case "aphelion":
              li = document.createElement("li");
              text = document.createTextNode(`Aphelion ${d[1]} km`);
              li.appendChild(text);
              document.getElementById("more-info").appendChild(li);
              break;
            case "eccentricity":
              li = document.createElement("li");
              text = document.createTextNode(`Eccentricity: ${d[1]}`);
              li.appendChild(text);
              document.getElementById("more-info").appendChild(li);
              break;
            case "inclination":
              li = document.createElement("li");
              text = document.createTextNode(`Orbital Inclination: ${d[1]}°`);
              li.appendChild(text);
              document.getElementById("more-info").appendChild(li);
              break;
            case "density":
              li = document.createElement("li");
              text = document.createTextNode(`Density: ${d[1]} g/cm³`);
              li.appendChild(text);
              document.getElementById("more-info").appendChild(li);
              break;
            case "gravity":
              li = document.createElement("li");
              text = document.createTextNode(`Gravity: ${d[1]} m/s²`);
              li.appendChild(text);
              document.getElementById("more-info").appendChild(li);
              break;
          }
        })
      });
  })
})


// fetch('https://api.le-systeme-solaire.net/rest/bodies/terre?data=englishName,aphelion,perihelion,semimajorAxis,eccentricity,density,gravity,inclination')
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     let h1;
//     let text;

//     Object.entries(data).forEach(d => {
//       switch (d[0]) {
//         case "englishName":
//           h1 = document.createElement("h1");
//           text = document.createTextNode(d[1]);
//           h1.appendChild(text);
//           document.getElementById("more-info").appendChild(h1);
//           break;
//         case "semimajorAxis":
//           li = document.createElement("li");
//           text = document.createTextNode(`Semimajor Axis ${d[1]} km`);
//           li.appendChild(text);
//           document.getElementById("more-info").appendChild(li);
//           break;
//         case "perihelion":
//           li = document.createElement("li");
//           text = document.createTextNode(`Perihelion ${d[1]} km`);
//           li.appendChild(text);
//           document.getElementById("more-info").appendChild(li);
//           break;
//         case "aphelion":
//           li = document.createElement("li");
//           text = document.createTextNode(`Aphelion ${d[1]} km`);
//           li.appendChild(text);
//           document.getElementById("more-info").appendChild(li);
//           break;
//         case "eccentricity":
//           li = document.createElement("li");
//           text = document.createTextNode(`Eccentricity: ${d[1]}`);
//           li.appendChild(text);
//           document.getElementById("more-info").appendChild(li);
//           break;
//         case "inclination":
//           li = document.createElement("li");
//           text = document.createTextNode(`Orbital Inclination: ${d[1]}°`);
//           li.appendChild(text);
//           document.getElementById("more-info").appendChild(li);
//           break;
//         case "density":
//           li = document.createElement("li");
//           text = document.createTextNode(`Density: ${d[1]} g/cm³`);
//           li.appendChild(text);
//           document.getElementById("more-info").appendChild(li);
//           break;
//         case "gravity":
//           li = document.createElement("li");
//           text = document.createTextNode(`Gravity: ${d[1]} m/s²`);
//           li.appendChild(text);
//           document.getElementById("more-info").appendChild(li);
//           break;
//       }
//     })
//   });
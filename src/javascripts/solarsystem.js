const svgContainer = d3.select("body").append("svg")
  .attr('class', 'svgContainer')
 
const starsContainer = svgContainer.append("g")
  .attr('class', 'stars')

function generateStars(number) {
  const stars = starsContainer.selectAll("circle")
    .data(d3.range(number).map(d =>
      i = { x: Math.random() * (2100), y: Math.random() * (2100), r: Math.random() * 1 }
    ))
    .enter().append("circle")
    .attr("class", "star")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r);
}

generateStars(1000);
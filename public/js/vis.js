function draw(data){
  console.log(data);
  d3.select('#chart').append('svg')
  .attr("width",1100)
  .attr("height",990)
  .append('circle')
  .attr('cx',400)
  .attr('cy',400)
  .attr('r',100)
  .attr('fill','#dd0000')
}

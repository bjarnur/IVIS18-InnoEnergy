//Manager of the chart related to this id
function init(){
  var element = document.getElementById('toggled');
  element.style = 'display: none;';
  d3.selectAll("svg").remove();
  bMonthlyChart = false;
  selectedYr = -1
}
function renderChart(id){
  //refresh all related charts

  //FIXME: It takes so long to use consumptionOnIntervalById on yearly level

  init();

  $.getJSON("/consumptionOnIntervalById/"+id+"/2012-01-01/2018-01-01/month").then(function(result){

    var element = document.getElementById('toggled');
    if(Object.keys(result).length != 0){
      element.style.display = '';
      drawYearlyChart(parseYearlyData(result),id);
    }
  });
}

function drawYearlyChart(chData,id){
  var canvasLineW = 1030,canvasLineH = 500;
	var	margin = {top: 20, right: 80, bottom: 30, left: 30};

  //Line Chart 
  var chartSVG = d3.select('#lineChartWrapper')
    .append("svg")
    .attr("width",canvasLineW)
    .attr("height", canvasLineH)

  chartSVG.append('g')
          .classed('lineChart',true)
          .attr('transform',"translate(" + margin.left + "," + margin.top + ")");

  var wLine = canvasLineW- margin.left - margin.right,
      hLine = canvasLineH - margin.top - margin.bottom;

	// set range
	var x = d3.scaleLinear().range([0, wLine]),
	    y = d3.scaleLinear().range([hLine, 0]);
      color = d3.scaleOrdinal(d3.schemeCategory10);

  // set domain
  x.domain([1,12]);
  y.domain([0,d3.max(chData,function(c){return d3.max(c.vals,function(d){return d.val})})]);
  color.domain(chData.map(function(d){return d.yr;}));

  // Yr indicator
  d3.select('svg g.lineChart')
    .append('text')
    .attrs({'id': 'yrLabel', 'x': 70, 'y': 250})
    .styles({'font-size': '100px', 'font-weight': 'bold', 'fill': '#ddd'});

  //Render Axis
  d3.select('svg g.lineChart')
    .append("g")
    .attr("class", "axis xAxis")
    .attr("transform", "translate(10," + hLine+ ")")
    .call(d3.axisBottom(x));

  d3.select('svg g.lineChart')
    .append("g")
    .attr("class", "axis yAxis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "translate(" + 100 +",0)")
    .text("Energy, kWh");


  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.val); });

  var lines= d3.select('svg g.lineChart').selectAll(".yr-line")
    .data(chData)
    .enter().append("g")
    .attr("class", "yr-line")
    .attr("id",function(d){
      return "yr-line" + d.yr;
    })
    .on('click',function(d){
      selectedYr = d.yr;
      updateYearlyChart();
    })
    .on('mouseover', function(d) {
      d3.select('#yrLabel')
        .text(d.yr)
        .transition()
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      d3.select('#yrLabel')
        .transition()
        .duration(1500)
        .style('opacity', 0);
    });

  lines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.vals); })
        .style("stroke", function(d) { return color(d.yr); })
    
  var canvasBarW = 360, canvasBarH = 500;
  var wBar = canvasBarW - margin.left - margin.right,
      hBar = canvasBarH - margin.top - margin.bottom;

  var barSVG = d3.select('#barChartWrapper')
      .append("svg")
      .attr("width",canvasBarW)
      .attr("height",canvasBarH)

  var barY = d3.scaleBand().range([hBar,0]).padding(0.3);
  //FIXME: Can use other scale method
  var barX = d3.scaleLinear().range([0,wBar]);

  barSVG.append('g')
        .classed('barChart',true)
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  barY.domain(chData.map(function(d){return d.yr;}))
  barX.domain([0,d3.max(chData,function(d){return d.sum;})])

  var bars = d3.select('svg g.barChart').selectAll(".yr-bar")
  .data(chData)
  .enter()
  .append("g")
  .attr("class","yr-bar")

  bars.append("rect")
  .attr("y", function(d) { return barY(d.yr); })
  .attr("width", function(d) {return barX(d.sum); } )
  .attr("height", barY.bandwidth())
  .attr("fill", function(d) {return color(d.yr);})
  .on('click',function(d){
    selectedYr = d.yr;
    updateYearlyChart();
  })
  .on('mouseover', function(d) {
    d3.select('#yrLabel')
      .text(d.yr)
      .transition()
      .style('opacity', 1);
  })
  .on('mouseout', function(d) {
    d3.select('#yrLabel')
      .transition()
      .duration(1500)
      .style('opacity', 0);
  })
  
  bars.append('text')
   .text(function(d){
    return d.yr + ": " + d.sum;
   })
  .style('font-size','20px')
  .attr('x',10)
  .attr('y',function(d){
    return (barY(d.yr) + barY.bandwidth()/2);
  });


  function makeBarYAxis(g){
    g.call(d3.axisLeft(barY));
    g.select(".domain").remove();
  }
   barSVG.append("g").call(makeBarYAxis);
   //barSVG.append("g").call(d3.axisLeft(barY));
}

function updateYearlyChart(){
  d3.selectAll('.yr-line')
  .classed('active',function(d){
    return selectedYr === d.yr;
  })
}

function updateMonthlyChart(){
}

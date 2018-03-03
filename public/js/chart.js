//Manager of the chart related to this id
function renderChart(id){
  //refresh all related charts
  d3.selectAll("svg").remove();

  //FIXME: It takes so long to use consumptionOnIntervalById on yearly level

  //Monthly part
  let selectedYr;
  $.getJSON("/consumptionOnIntervalById/"+id+"/2012-01-01/2018-01-01/month").then(function(result){
    //drawYearlyBarChart(result);
    //parseYearlyChart(result);
    var element = document.getElementById('toggled');
    element.style.display = '';
    drawYearlyChart(parseYearlyData(result),id);
  });
}
function parseYearlyData(chData){
  var ret = [];
  for(let yr in chData){
    var yrData = {};
    yrData['yr'] = yr;
    yrData['vals'] = [];
    for(let month in chData[yr]){
      //yrData['vals'][].push({
        //time: parseInt(month),
        //val: chData[yr][month].sum,
        //cnt: chData[yr][month].count
      //});
      yrData['vals'][parseInt(month)-1] = {
        time: month,
        val: chData[yr][month].sum,
        cnt: chData[yr][month].count
      };
    }
    ret.push(yrData);
  }
  console.log(ret);
  return ret;
}
function drawYearlyChart(chData,id){
  var canvasW = 1130,canvasH = 500;
	var	margin = {top: 20, right: 80, bottom: 30, left: 30};

  var chartSVG = d3.select('#lineChart')
    .append("svg")
    .attr("width",canvasW)
    .attr("height", canvasH)

  var width = canvasW- margin.left - margin.right,
      height = canvasH - margin.top - margin.bottom,
      g = chartSVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.val); });

	// set the ranges
	var x = d3.scaleLinear().range([0, width]),
	    y = d3.scaleLinear().range([height, 0]);
      z = d3.scaleOrdinal(d3.schemeCategory10);

  // set domain
  x.domain([1,12]);
  y.domain([0,d3.max(chData,function(c){return d3.max(c.vals,function(d){return d.val})})]);
  z.domain(chData.map(function(d){return d.yr;}));
  //y.domain([0,d3.max(d3.values(chData),function(c){return d3.max(d3.values(c),function(d){return d.sum})})]); //for json


   g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Hao");

  var lines= g.selectAll(".yr-line")
    .data(chData)
    .enter().append("g")
    .attr("class", "yr-line");

  lines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.vals); })
        .style("stroke", function(d) { return z(d.yr); });

  //city.append("text")
      //.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      //.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      //.attr("x", 3)
      //.attr("dy", "0.35em")
      //.style("font", "10px sans-serif")
      //.text(function(d) { return d.id; });

}
function drawDailyChart(month,data,id){
  d3.select("#dailyChart").remove();
}
//function drawChart(result){
  //console.log("drawChart");
  //console.log(result);
//}
//function 

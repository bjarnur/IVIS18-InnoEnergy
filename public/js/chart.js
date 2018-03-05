//refresh related chart
function init(id){
  document.getElementById('toggled').style = 'display: none;';
  document.getElementById('toggled2').style = 'display: none;';
  d3.select("#nodata").text('');
  d3.selectAll("svg").remove();
  bMonthlyChart = false;
  selectedYr = -1
  curId = id;
}

/*Manager of the chart related to this id*/
//FIXME: It takes so long to use consumptionOnIntervalById on yearly level
function renderChart(id){
  init(id);

  $.getJSON("/maximumConsumptionOnIntervalById/"+curId+"/2012-01-01/2018-01-01/month").then(function(result){
  //$.getJSON("/consumptionOnIntervalById/"+curId+"/month/2012-01-01/2018-01-01").then(function(result){


    document.getElementById('toggled').style.display = '';
    if(Object.keys(result).length > 1){
      drawYearlyChart(parseYearlyData(result));
    }
    else{
      d3.select("#nodata").text('Sorry... No Data Here');
      console.log(curId + "doesn't have data");
    }
  });
}
/*Draw the upper chart*/
function drawYearlyChart(chData){

  //Line Chart Section
  let chartSVG = d3.select('#lineChartWrapper')
    .append("svg")
    .attr("width",canvasLineW)
    .attr("height", canvasLineH)

  chartSVG.append('g')
          .classed('lineChart',true)
          .attr('transform',"translate(" + margin.left + "," + margin.top + ")");


	//Set range
	let x = d3.scaleLinear().range([10, wLine]),
	    y = d3.scaleLinear().range([hLine, 0]);
      color = d3.scaleOrdinal(d3.schemeCategory10);

  //Set domain
  x.domain([1,12]);
  y.domain([0,d3.max(chData,function(c){return d3.max(c.vals,function(d){
    if(typeof d == 'undefined') return 0;
    else return d.val + 2;
  })})]);
  color.domain(chData.map(function(d){return d.yr;}));

  //Yr indicator
  d3.select('svg g.lineChart')
    .append('text')
    .attrs({'id': 'yrLabel', 'x': 70, 'y': 400});
    //.styles({'font-size': '100px', 'font-weight': 'bold', 'fill': '#ddd'});

  //Render Axis
  d3.select('svg g.lineChart')
    .append("g")
    .attr("class", "axis xAxis")
    .attr("transform", "translate(2," + hLine+ ")")
    .call(d3.axisBottom(x));

  d3.select('svg g.lineChart')
    .append("g")
    .attr("class", "axis yAxis")
    .attr("transform", "translate(" + 10+",0)")
    .call(d3.axisLeft(y))

  //Energy line def
  let line = d3.line()
      .defined(function(d) { return d; })
      .curve(d3.curveBasis)
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.val); });

  //Animation (use curtain method)
  chartSVG.append('rect')
      .attr('x', -1 * (wLine+30))
      .attr('y', -1 * hLine)
      .attr('height', hLine)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#ffffff')
      .attr('width', wLine-15)
      .transition()
      .duration(5000)
      .attr('width',0);
  //Set energy line
  //lines: collection of all yearly line
  let lines= d3.select('svg g.lineChart').selectAll(".yr-line")
    .data(chData)
    .enter().append("g")
    .attr("class", "yr-line")
    .style("opacity",function(d){
      if(d.yr == "Capacity"){
        for(let i=0;i<d.vals.length;++i){
          if (typeof d.vals[i] !== "undefined" && d.vals[i].val != 0){
            return 1;
          }
        }
        return 0;
      }
      else
        return 1;
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


  //Bar Chart Section
  let barSVG = d3.select('#barChartWrapper')
      .append("svg")
      .attr("width",canvasBarW)
      .attr("height",canvasBarH)

  barSVG.append('g')
        .classed('barChart',true)
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  let barY = d3.scaleBand().range([hBar,0]).padding(0.3);
  //FIXME: Can use other scale method
  let barX = d3.scaleLinear().range([0,wBar]);


  //Set range
  barY.domain(chData.map(function(d){return d.yr;}))
  barX.domain([0,d3.max(chData,function(d){return d.sum;})])

  //bars: collection of all aggregated bars
  let bars = d3.select('svg g.barChart').selectAll(".yr-bar")
  .data(chData)
  .enter()
  .append("g")
  .attr("class","yr-bar");
  
  bars.append("rect")
    .attr("y", function(d) { return barY(d.yr); })
    .attr("fill", function(d) {return color(d.yr);})
    .attr("height", barY.bandwidth())
    .attr("width",0)
    .transition()
    .duration(1000)
    .attr("width", function(d) {return barX(d.sum); } )
    

  //Add text (I don't know how to customize tick)
  //Note: need to add before addEventListner
  bars.append('text')
  //.style('font-size','25px')
 //.style('fill','#FFF')
  .attr('x',10)
  .attr('y',function(d){
    return (barY(d.yr) + 10 +  barY.bandwidth()/2);
  })
  .text(function(d){
   return d.yr + ": " + d.sum;
  });

  //Set event
  bars.on('click',function(d){
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

  //Use this to prevent ugly line axis appeared in the left
  function makeBarYAxis(g){
    g.call(d3.axisLeft(barY));
    g.select(".domain").remove();
  }
   barSVG.append("g").call(makeBarYAxis);
   //barSVG.append("g").call(d3.axisLeft(barY));
}

/*When clicking the bar of line on yearly plot, this function will be called*/
function updateYearlyChart(){

  //Highlight the seleected yr line
  d3.selectAll('.yr-line')
  .classed('active',function(d){
    return selectedYr === d.yr;
  })

  if(!bMonthlyChart){
    initMonthlyChart();
  }
  else{
    //re-render
    d3.select("#MonthlylineChartWrapper").selectAll("svg").remove();
    d3.select('#MonthlybarChartWrapper').selectAll('svg').remove();
  }

  updateMonthlyChart();

}

/*Open the monthly chart canvas*/
function initMonthlyChart(){
  document.getElementById('toggled2').style='';
  bMonthlyChart = true;
}

/*When clicking the bar of line on yearly plot, this function will be called*/
function updateMonthlyChart(){
  d3.select('#selectedYr').text(selectedYr);

  function yrRange(yr){
    //return "/day/"+yr+"-01-01/"+(yr+1)+"-01-01";
    return "/"+yr+"-01-01/"+(yr+1)+"-01-01/day";
  }

  //Get the consumption data of selected yr
  $.getJSON("maximumConsumptionOnIntervalById/"+curId+yrRange(parseInt(selectedYr))).then(function(res){
    let chData = parseMonthlyData(res);

    //Same as above
    //FIXME: duplicated code, some bad smell...Orz
    let chartSVG = d3.select('#MonthlylineChartWrapper')
      .append("svg")
      .attr("width",canvasLineW)
      .attr("height",canvasLineH)

    chartSVG.append('g')
            .classed('lineChart2',true)
            .attr('transform',"translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleLinear().range([10, wLine]),
        y = d3.scaleLinear().range([hLine, 0]);
        color = d3.scaleOrdinal(d3.schemeCategory20);

    // set domain
    x.domain([1,31]);
    y.domain([0,d3.max(chData,function(c){
      if(typeof c == 'undefined') return 0;
      else return d3.max(c.vals,function(d){
        if(typeof d == 'undefined') return 0;
        else return d.val + 2;
    })})]);
    color.domain(chData.map(function(d){return d.month;}));

    //Month indicator
    d3.select('svg g.lineChart2')
      .append('text')
      .attrs({'id': 'mLabel', 'x': 70, 'y': 400});
     // .styles({'font-size': '80px', 'font-weight': 'bold', 'fill': '#ddd'});

    //Render Axis
    d3.select('svg g.lineChart2')
      .append("g")
      .attr("class", "axis xAxis")
      .attr("transform", "translate(2," + hLine+ ")")
      .call(d3.axisBottom(x));

    d3.select('svg g.lineChart2')
      .append("g")
      .attr("class", "axis yAxis")
      .attr("transform", "translate(" + 10 +",0)")
      .call(d3.axisLeft(y))

    //Animation
    chartSVG.append('rect')
        .attr('x', -1 * (wLine+30))
        .attr('y', -1 * hLine)
        .attr('height', hLine)
        .attr('class', 'curtain')
        .attr('transform', 'rotate(180)')
        .style('fill', '#ffffff')
        .attr('width', wLine-15)
        .transition()
        .duration(5000)
        .attr('width',0);

    let line = d3.line()
        .defined(function(d) { return d; })
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.val); });


    console.log(chData);
    //add id for monthly line for highlighting
    let lines= d3.select('svg g.lineChart2').selectAll(".m-line")
      .data(chData)
      .enter().append("g")
      .attr("class", "m-line")
      .attr("id",function(d){
        return "m-line" + d.month;
      })
      .on('mouseover', function(d) {
        d3.select('#mLabel')
          .text(months[d.month])
          .transition()
          .style('opacity', 1);
      })
      .on('mouseout', function(d) {
        d3.select('#mLabel')
          .transition()
          .duration(1500)
          .style('opacity', 0);
      });

    lines.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.vals); })
          .style("stroke", function(d) { return color(d.month); })

    let barSVG = d3.select('#MonthlybarChartWrapper')
        .append("svg")
        .attr("width",canvasBarW)
        .attr("height",canvasBarH)

    barSVG.append('g')
          .classed('barChart2',true)
          .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    //FIXME: Can use other scale method
    let barY = d3.scaleBand().range([hBar,0]).padding(0.1);
    let barX = d3.scaleLinear().range([0,wBar]);
    //The bar chart will be sorted, but the color of each month is the same
    let sortedData = chData.sort(function(a,b){return d3.ascending(a.sum,b.sum);});

    barY.domain(sortedData.map(function(d){return d.month;}))
    barX.domain([0,d3.max(chData,function(d){return d.sum;})])

    let bars = d3.select('svg g.barChart2').selectAll(".yr-bar2")
    .data(sortedData)
    .enter()
    .append("g")
    .attr("class","yr-bar2")

    bars.append("rect")
    .attr("y", function(d) { return barY(d.month); })
    .attr("fill", function(d) {return color(d.month);})
    .attr("height", barY.bandwidth())
    .attr("width",0)
    .transition()
    .duration(1000)
    .attr("width", function(d) {return barX(d.sum); } )


    bars.select('text').remove();
    bars.append('text')
     .text(function(d){
      return months[d.month] + ": " + d.sum;
     })
   // .style('font-size','12px')
   // .style("fill","#FFF")
    .attr('x',10)
    .attr('y',function(d){
      return (barY(d.month)+10 + barY.bandwidth()/2);
    });


    //Highlight hovered month (use id to get related line)
    bars.on('mouseover', function(d) {
      d3.select('#m-line'+d.month).classed('active',true);
      d3.select('#mLabel')
        .text(months[d.month])
        .transition()
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      d3.select('#m-line'+d.month).classed('active',false);
      d3.select('#mLabel')
        .transition()
        .duration(1500)
        .style('opacity', 0);
    })
    function makeBarYAxis(g){
      g.call(d3.axisLeft(barY));
      g.select(".domain").remove();
    }
     barSVG.append("g").call(makeBarYAxis);
    })
}

// JavaScript Document
var chartGlobal = 'data/dummy1.tsv';
	
	function toggleChart(name) {
		
		if (chartGlobal == 'data/dummy1.tsv') {
			chartGlobal = 'data/dummy2.tsv'
			drawChart('data/dummy2.tsv');
		}
		else {
			chartGlobal = 'data/dummy1.tsv'
			drawChart('data/dummy1.tsv');
		}
		var element = document.getElementById('toggled');
		element.style.display = '';	
	}
	
	function setInfo() {
		var textToWrite = '';
		var textToWrite = document.getElementById('titleIW').textContent;
		var element = document.getElementById('markerinfo'); 
		element.textContent = textToWrite;
	}


function drawChart(dummydata) {
	d3.selectAll("svg > *").remove();
	var svg = d3.select("svg"),
		margin = {top: 20, right: 80, bottom: 30, left: 50},
		width = svg.attr("width") - margin.left - margin.right,
		height = svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%H:%M");

	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.time); })
		.y(function(d) { return y(d.energy); });

	d3.tsv(dummydata, type, function(error, data) {
	  if (error) throw error;

	  var inout = data.columns.slice(1).map(function(id) {
		return {
		  id: id,
		  values: data.map(function(d) {
			return {time: d.time, energy: d[id]};

		  })
		};
	  });
		 //console.log("data in" + data);
	  x.domain(d3.extent(data, function(d) { return d.time; }));

	  y.domain([
		d3.min(inout, function(c) { return d3.min(c.values, function(d) { return d.energy; }); }),
		d3.max(inout, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })
	  ]);

	  z.domain(inout.map(function(c) { return c.id; }));

	  g.append("g")
		  .attr("class", "axis axis--x")
		  .attr("transform", "translate(0," + height + ")")
		  .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")));

	  var t = d3.transition()
		.duration(3000)
		.ease(d3.easeLinear)
		.on("start", function(d){ console.log("transiton start") })
		.on("end", function(d){ console.log("transiton end") })

	  g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Energy, kWh");

	  var energyLine = g.selectAll(".energyLine")
            .data(inout)
            .enter().append("g")
            .attr("class", "energyLine");

	  energyLine.append("path")
		  .attr("class", "line")
		  .attr("d", function(d) { return line(d.values); })
		  .style("stroke", function(d) { return z(d.id); })
		  .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
		  .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

	  g.selectAll(".line").transition(t)
			.attr("stroke-dashoffset", 0)

	  energyLine.append("text")
		  .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		  .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.energy) + ")"; })
		  .attr("x", 3)
		  .attr("dy", "0.35em")
		  .style("font", "10px sans-serif")
		  .text(function(d) { return d.id; });
	});

	function type(d, _, columns) {
	  d.time = parseTime(d.time);
	  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
	  return d;
	}
}
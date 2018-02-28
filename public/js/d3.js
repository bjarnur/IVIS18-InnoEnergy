// JavaScript Document


// /consumptionOnIntervalById/:id/:from/:to

var chartGlobal = 'data/dummy1.tsv';
	
	function toggleChart(name, id) {
		
		console.log(id);
		
		$.getJSON("/consumptionOnIntervalById/" + id + "/2012-01-01/2012-12-31").then(function(result){  
			console.log("JSON result " + typeof result[0].timestamp);
			if ((result[0].value != "0") || (result[0].value != null)) {
				console.log("hej " + result[0].value);
				drawJSONChart(result);
				var element = document.getElementById('toggled');
				element.style.display = '';	
			}
			if ((result[0].value == 'null') || (result[0].value == "0")) {
				console.log("no data"); // need to do something about these cases 
				var element = document.getElementById('toggled');
				element.style.display = '';
				element.style.height = '200px';
			}
			
		});
		
		/*
		if (chartGlobal == 'data/dummy1.tsv') {
			chartGlobal = 'data/dummy2.tsv'
			drawChart('data/dummy2.tsv');
		}
		else {
			chartGlobal = 'data/dummy1.tsv'
			drawChart('data/dummy1.tsv');
		}
		*/
		
	}
	
	function setInfo(building) {
		
		console.log(building);
		
		var nameelement = document.getElementById('markerinfo'); 
		nameelement.textContent = building.address.replace(/"/g, '').replace(';', ',');
		
		var fuseelement = document.getElementById('fuseinfo');
		fuseelement.textContent = building.fuse + ' Ampere';
		
		if (building.additional_info != "") {
			var addelement = document.getElementById('addinfo');
			addelement.textContent = 'Additional information: ' + building.additional_info;
		}
		if (building.additional_info == "") {
			var addelement = document.getElementById('addinfo');
			addelement.textContent = '';
		}
		
		
		var subelement = document.getElementById('subinfo');
		subelement.textContent = building.subscription;
		
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
		  .style("stroke", "#004494")
		  .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
		  .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

	  g.selectAll(".line").transition(t)
			.attr("stroke-dashoffset", 0)

	  energyLine.append("text")
		  .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		  .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.energy) + ")"; })
		  .attr("x", 3)
		  .attr("dy", "0.35em")
		  .style("font", "10px 'Titillium Web', sans-serif")
		  .text(function(d) { return d.id; });
	});

	function type(d, _, columns) {
	  d.time = parseTime(d.time);
	  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
	  return d;
	}
}

function drawJSONChart(file) {
	
	var data = file;
	console.log(data);
	
	d3.selectAll("svg > *").remove();
	var svg = d3.select("svg"),
		margin = {top: 20, right: 80, bottom: 30, left: 30},
		width = svg.attr("width") - margin.left - margin.right,
		height = svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// parse the date / time
	var parseTime = d3.timeFormat("%Y-%m-%d");

	// set the ranges
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the line
	var valueline = d3.line()
		.x(function(d) { return x(d.timestamp); })
		.y(function(d) { return y(d.value); })
		.curve(d3.curveMonotoneX);
	
	data.forEach(function(d) {
		  //d.timestamp = parseTime(new Date(d.timestamp));
		  //d.value = +d.value;
			d.timestamp = new Date(d.timestamp); // Parsing dates not work ATM
			d.value = +d.value;
		  return d;
	  });

	  // Scale the range of the data
	  x.domain(d3.extent(data, function(d) { return d.timestamp; }));
	  y.domain([0, d3.max(data, function(d) { return d.value; })]);
		
	console.log(data);
	  // Add the valueline path.
	  svg.append("path")
		  .data(data)
		  .attr("class", "line")
		  .attr("transform", "translate (" + 20 + " 0)")
		  .attr("d", valueline(data));

	  // Add the X Axis
	  svg.append("g")
		  .attr("transform", "translate(20," + height + ")")
		  .call(d3.axisBottom(x));

	  // Add the Y Axis
	  svg.append("g").attr("transform", "translate (" + 20 + ", 0)")
		  .call(d3.axisLeft(y));
	
	svg.append("text")
	  .attr("transform", "translate(20+" + (width / 2) + " ," +
		(height + margin.top + 20) + ")")
	  .style("text-anchor", "middle")
	  .text("Date");
		  
}
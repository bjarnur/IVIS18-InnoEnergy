function parseData(data){
  var ret = {};
  ret['id'] = data[0].id;
  ret['data'] = {};

  data.forEach(function(e){
    if(!isNaN(e['value'])){
      ret['data'][e['timestamp']] = e['value']
    }
  });
  return ret;
}

function draw(data){
  var data = parseData(data);

  var svg = d3.select('#chart').append('svg'),
      margin = {top: 20, right: 80, bottom: 30, left: 50},
      width = svg.attr("width") - margin.left - margin.right,
      height = svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  console.log(data);


  var parseTime = d3.timeParse("%H:%M");
  //var x = d3.scaleTime().range([0, width]),
      //y = d3.scaleLinear().range([height, 0]),
      //z = d3.scaleOrdinal(d3.schemeCategory10);
  //var line = d3.line()
    //.curve(d3.curveBasis)
    //.x(function(d) { return x(d.time); })
    //.y(function(d) { return y(d.energy); });

    ////d3.tsv("dummydata.tsv", type, function(error, data) {
    //var inout = data.columns.slice(1).map(function(id) {
    //return {
      //id: id,
      //values: data.map(function(d) {
      //return {time: d.time, energy: d[id]};
       
      //})
    //};
    //});
     ////console.log("data in" + data);
    //x.domain(d3.extent(data, function(d) { return d.time; }));
    //y.domain([
    //d3.min(inout, function(c) { return d3.min(c.values, function(d) { return d.energy; }); }),
    //d3.max(inout, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })
    //]);
    //z.domain(inout.map(function(c) { return c.id; }));
    //g.append("g")
      //.attr("class", "axis axis--x")
      //.attr("transform", "translate(0," + height + ")")
      //.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")));
    //g.append("g")
      //.attr("class", "axis axis--y")
      //.call(d3.axisLeft(y))
    //.append("text")
      //.attr("transform", "rotate(-90)")
      //.attr("y", 6)
      //.attr("dy", "0.71em")
      //.attr("fill", "#000")
      //.text("Energy, kWh");
    //var energyLine = g.selectAll(".energyLine")
    //.data(inout)
    //.enter().append("g")
      //.attr("class", "energyLine");
    //energyLine.append("path")
      //.attr("class", "line")
      //.attr("d", function(d) { return line(d.values); })
      //.style("stroke", function(d) { return z(d.id); });
    //energyLine.append("text")
      //.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      //.attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.energy) + ")"; })
      //.attr("x", 3)
      //.attr("dy", "0.35em")
      //.style("font", "10px sans-serif")
      //.text(function(d) { return d.id; });
    ////});
    //function type(d, _, columns) {
      //d.time = parseTime(d.time);
      //for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
      //return d;
    //}
}

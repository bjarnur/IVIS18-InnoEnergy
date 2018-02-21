function parseData(data){
  var ret = {};
  ret['id'] = data[0].id;
  ret['data'] = [];

  data.forEach(function(e){
    if(!isNaN(e['value'])){
      ret['data'].push({
        timestamp: new Date(e['timestamp']),
        consumption: parseFloat(e['value'])
      });
    }
  });
  return ret;
}

function draw(data){
  var data = parseData(data);

  var chart = d3_timeseries()
            .addSerie(data['data'],{x:'timestamp',y:'consumption'},{interpolate:'monotone',color:"#333"})
              .width(1200)

  chart('#chart')
}

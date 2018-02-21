function parseData(data){
  var ret = {};
  ret['id'] = data[0].id;
  ret['data'] = [];

  data.forEach(function(e){
    if(!isNaN(e['value'])){
      ret['data'].push({
        time: new Date(e['timestamp']),
        consump: parseFloat(e['value'])
      });
    }
  });
  return ret;
}

function draw(data){
  var data = parseData(data);

  //I prefer writing by my own, because theres is no docs for customization :(
  var chart = d3_timeseries()
             .addSerie(data['data'],{x:'time',y:'consump'},{interpolate:'monotone',color:"#FF7F50"})
             .height(900)
             .width(1400)
  chart('#chart')
}

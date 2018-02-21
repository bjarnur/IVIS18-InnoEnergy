$(document).ready(function(){
  //create initial map
  map = new GMaps({
    div: '#map',
    lat: 59.349845,
    lng: 18.070606,
  });
  
  //receive the searching query
  $('#geocoding_form').submit(function(e){
    console.log("Receive idx : " + $('#idx').val());
    var params = {
      idx: $('#idx').val()
    };
    var addr = "Brevduvegatan 8, Örebro"; // later will get from DB as follows
    e.preventDefault();
    
    //$.ajax({
      //data: JSON.stringify(params),
      //url: '/search_addr',
      //type: 'POST',
      //contentType: 'application/json',
      //cache: false,
      //timeout: 2000,
          //success: function(data,status){
            //addr = data // retrieve the address from DB
          //},
    //});
    
    //show the according location
    GMaps.geocode({
      address: addr,
      callback: function(results, status){
        if(status=='OK'){
          var latlng = results[0].geometry.location;
          map.setCenter(latlng.lat(), latlng.lng());
          map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng(),
            //can also add some infoWindow/tooltip...
          });
        }
      }
    });

    //To retrieve the value
    $.ajax({
      data: JSON.stringify(params),
      url: '/search',
      type: 'POST',
      contentType: 'application/json',
      cache: false,
      timeout: 2000,
    			success: function(data,status){
            d3.select('#chart-wrapper').select('#chart').remove();
            d3.select('#chart-wrapper')
              .append('div')
              .attr('id','chart');
            draw(data);
    			},
    });
  });
});

$(document).ready(function(){
  map = new GMaps({
    div: '#map',
    lat: 59.349845,
    lng: 18.070606,
  });
  $('#geocoding_form').submit(function(e){
    console.log("Receive idx : " + $('#idx').val());
    var params = {
      idx: $('#idx').val()
    };
    e.preventDefault();
    GMaps.geocode({
      //later will get the address from DB of orebro_fuses by ID
      address: "Brevduvegatan 8, Örebro",
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
    $.ajax({
      data: JSON.stringify(params),
      url: '/map',
      type: 'POST',
      contentType: 'application/json',
      cache: false,
      timeout: 2000,
    			success: function(data){
            console.log(data);
    			},
    });
  });
});

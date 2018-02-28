// JavaScript Document

var icons = {
    16: {
		icon: 'images/house-pink.png'
	  },
    20: {
		icon: 'images/house-red.png'
	  },
    25: {
		icon: 'images/house-orange.png'
	  },
    35: {
		icon: 'images/house-green.png'
	  },
    50: {
		icon: 'images/house-turquoise.png'
	  },
    63: {
		icon: 'images/house-blue.png'
	  },
    Effekt: {
		icon: 'images/house-purple.png'
	  }
	};

var buildings = [];

var map;var markers = []; var markerCluster = null;

function loadBuildings() {       
    $.getJSON("/buildings").then(function(result){  
		//console.log(result);
    	initMap(result);
    	createBuildingsLegend(result);
	});
}

function searchBuildings() {
	
	var address = document.getElementById("buildingSearchField").value;
	if(address == "") {
		//Handle empty search
		loadBuildings();
	}

	$.getJSON("/buildingsByAddress/" + address).then(function(result){   
    	//initMap(result);
    	createBuildingsLegend(result);
	});	
}

function initMap(buildings) {
	var orebro = {lat: 59.2739, lng: 15.2133};
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: orebro, 
	  disableDefaultUI: true,
	  styles: [					  {
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#f5f5f5"
				  }
				]
			  },
			  {
				"elementType": "labels.icon",
				"stylers": [
				  {
					"visibility": "off"
				  }
				]
			  },
			  {
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#616161"
				  }
				]
			  },
			  {
				"elementType": "labels.text.stroke",
				"stylers": [
				  {
					"color": "#f5f5f5"
				  }
				]
			  },
			  {
				"featureType": "administrative.land_parcel",
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#bdbdbd"
				  }
				]
			  },
			  {
				"featureType": "administrative.neighborhood",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#000000"
				  }
				]
			  },
			  {
				"featureType": "landscape.man_made",
				"elementType": "geometry",
				"stylers": [
				  {
					"weight": 2
				  }
				]
			  },
			  {
				"featureType": "landscape.man_made",
				"elementType": "geometry.fill",
				"stylers": [
				  {
					"color": "#dddddd"
				  },
				  {
					"saturation": -100
				  },
				  {
					"lightness": 10
				  }
				]
			  },
			  {
				"featureType": "landscape.man_made",
				"elementType": "geometry.stroke",
				"stylers": [
				  {
					"color": "#ffffff"
				  }
				]
			  },
			  {
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#eeeeee"
				  }
				]
			  },
			  {
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#757575"
				  }
				]
			  },
			  {
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#96c147"
				  },
				  {
					"saturation": -20
				  },
				  {
					"lightness": 0
				  }
				]
			  },
			  {
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#9e9e9e"
				  }
				]
			  },
			  {
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#ffffff"
				  }
				]
			  },
			  {
				"featureType": "road.arterial",
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#757575"
				  }
				]
			  },
			  {
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#dadada"
				  }
				]
			  },
			  {
				"featureType": "road.highway",
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#616161"
				  }
				]
			  },
			  {
				"featureType": "road.local",
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#9e9e9e"
				  }
				]
			  },
			  {
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#e5e5e5"
				  }
				]
			  },
			  {
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#eeeeee"
				  }
				]
			  },
			  {
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
				  {
					"color": "#004494"
				  },
				  {
					"saturation": -40
				  },
				  {
					"lightness": 60
				  }
				]
			  },
			  {
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
				  {
					"color": "#9e9e9e"
				  }
				]
			  }
			]
	});

	setMarkers(map,buildings);
}

function setMarkers(map,buildings) {

	for (var i = 0; i < Object.keys(buildings).length; i++) {  
		
		var building = buildings[i];
		var buildingid = buildings[i].id;
		var name = building.address;
		var info =  "Fuse type: " + building.fuse + " A";
		var icon_id = icons[building.fuse].icon; 
		var latlngset = {
			lat: parseFloat(building.latitude), 
			lng: parseFloat(building.longitude)
		};
		
		var infoWindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({  
			map: map, title: name , position: latlngset, icon: icon_id, id: buildingid  
		});
		markers.push(marker);
		

		(function (marker, name, info, buildingid) {
			google.maps.event.addListener(marker, "click", function (e) {
				//Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
				//console.log(marker);
				infoWindow.setContent("<div id='iw-container'><div class='iw-title' id='titleIW'>" + name.replace(/"/g, '').replace('; Örebro', '') + "</div><div class='iw-infotext'>" + info +  "</div></div>");
				infoWindow.open(map, marker); toggleChart(name, buildingid); setInfo(); 
			});
            
		})(marker, name, info, buildingid);	
	}
	markerCluster = new MarkerClusterer(map, markers, {imagePath: 'images/m', maxZoom: 15});
}

function clearOverlays() {
  for (var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
  markers.length = 0;
	markers = [];
	markerCluster.clearMarkers();
}
function filterMarkers(type) {
	clearOverlays();
	markerCluster = null;
  var ret;
	var filteredLocations = [];
  if(type == 'all'){
    $.getJSON("buildings").then(function(result){
      initMap(result);
      createBuildingsLegend(result);
    });

  }
  else{
    $.getJSON("/buildingsByFuse/" + type).then(function(result){
      initMap(result);
      createBuildingsLegend(result);
    });
  }
}

function createBuildingsLegend(buildings) {
	var findDiv = document.getElementById('buildingsLegend');
	findDiv.innerHTML = '';

	for (i = 0; i < Object.keys(buildings).length; i++) {
		var node = document.createElement("li");
		var textnode = document.createTextNode(buildings[i].address.replace(/"/g, "").replace("; Örebro", ""));
		node.setAttribute('onclick', 'centerMap(' + buildings[i].latitude +',' + buildings[i].longitude + ')');
		node.appendChild(textnode)
		findDiv.appendChild(node);
	}
}

function searchStreetName(street) {
	for (i=0; i <locations.length; i++) {
		if (street == locations[i][0]) {
			centerMap(locations[i][1], locations[i][2]);
			continue;
		}
	}
}

function centerMap(latitude, longitude) {
	map.setCenter({lat: latitude, lng: longitude});
    map.setZoom(16);
}


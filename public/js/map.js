// JavaScript Document

var icons = {
	  green: {
		icon: 'images/home-green.png'
	  },
	  red: {
		icon: 'images/home-red.png'
	  },
	  yellow: {
		icon: 'images/home-yellow.png'
	  }
	};

var locations = [
	['Fredsgatan', 59.27562163725686, 15.219332817504892, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'red'],
	['Folkungagatan', 59.27614785296132, 15.197617653320322, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'red'],
	['Rådmansgatan', 59.26768356399684, 15.222422722290048, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'red'],
	['Idrottsvägen', 59.26698571712036, 15.196428335319752, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'green'],
	['Örnsköldsgatan', 59.28259145795628, 15.183455589721689, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'green'],
	['Oljevägen', 59.2740243487018, 15.243206060539364, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'green'],
	['Norrbackavägen', 59.281654038440564, 15.217628515373463, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'green'],
	['Faktorigatan', 59.27375929462481, 15.223035848747486, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'yellow'],
	['Otto E Andersens Gata', 59.27334522476262, 15.184154546867603, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur est velit, dictum at nulla non, porta aliquam quam.', 'yellow'],
];

var buildings = [];

function buildingsArray (input) {
	for (i = 0; i < locations.length; i++) {  
		buildings.push(locations[i][0]);
	}
}

var map;var markers = []; var markerCluster = null;

function loadBuildings() {       
    $.getJSON("/buildings").then(function(result){    	    	
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
    	initMap(result);
    	createBuildingsLegend(result);
	});	
}

function initMap(buildings) {
	var orebro = {lat: 59.2739, lng: 15.2133};
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 14,
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
					"lightness": -5
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
					"color": "#00b33c"
				  },
				  {
					"saturation": -75
				  },
				  {
					"lightness": 50
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
					"color": "#0099ff"
				  },
				  {
					"saturation": -75
				  },
				  {
					"lightness": 30
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
	
	
	console.log(buildings[0]);
	console.log(Object.keys(buildings).length);
	for (var i = 0; i < Object.keys(buildings).length; i++) {  
		
		var building = buildings[i]
		var name = building.address;
		var info =  "Fuse type: " + building.fuse;
		var icon_id = 'images/home-green.png'; //TODO use fuse type here
		var latlngset = {
			lat: parseFloat(building.latitude), 
			lng: parseFloat(building.longitude)
		};

		var infoWindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({  
			map: map, title: name , position: latlngset, icon: icon_id  
		});
		markers.push(marker);

		(function (marker, name, info) {
			google.maps.event.addListener(marker, "click", function (e) {
				//Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
				infoWindow.setContent("<div id='iw-container'><div class='iw-title' id='titleIW'>" + name + "</div><div class='iw-infotext'>" + info + "</div></div>");
				infoWindow.open(map, marker); toggleChart(name); setInfo(); 
			});
            
		})(marker, name, info);	
	}
	markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
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
	markerCluster=null;
	var filteredLocations = [];
	if (type == 'all') {
			filteredLocations = locations;
		}
	else {
		for (i = 0; i < locations.length; i++) {
			if (type == locations[i][4]) {
				filteredLocations.push(locations[i]);
			}
		}
	}
	console.log(filteredLocations);
	setMarkers(map, filteredLocations);
}

function createBuildingsLegend(buildings) {
	var findDiv = document.getElementById('buildingsLegend');
	findDiv.innerHTML = '';

	console.log(buildings);

	for (i = 0; i < Object.keys(buildings).length; i++) {
		var node = document.createElement("li");
		var textnode = document.createTextNode(buildings[i].address);
		node.setAttribute('onclick', 'centerMap(' + buildings[i].latitude +',' + buildings[i].longitude + ')');
		node.appendChild(textnode)
		findDiv.appendChild(node);
	}
}

function searchStreetName(street) {
	for (i=0; i <locations.length; i++) {
		if (street == locations[i][0]) {
			console.log({lat: locations[i][1], lng: locations[i][2]});
			centerMap(locations[i][1], locations[i][2]);
			continue;
		}
	}
}

function centerMap(latitude, longitude) {
	map.setCenter({lat: latitude, lng: longitude});
}
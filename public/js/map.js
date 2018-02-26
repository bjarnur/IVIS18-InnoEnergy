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

function initMap() {
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

	setMarkers(map,locations);
}

function setMarkers(map,posArray) {

var marker, i;

	for (i = 0; i < posArray.length; i++) {  
		var name = posArray[i][0];
		var info =  posArray[i][3];
		var icon_id = icons[posArray[i][4]].icon;

        
		latlngset = {lat: posArray[i][1], lng: posArray[i][2]};
			//new google.maps.LatLng(lat, long);

		var infoWindow = new google.maps.InfoWindow();
		
		
		
		var marker = new google.maps.Marker({  
			map: map, title: name , position: latlngset, icon: icon_id  
			});
		markers.push(marker);

		(function (marker, name, info) {
			google.maps.event.addListener(marker, "click", function (e) {
				//Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
				infoWindow.setContent("<div id='iw-container'><div class='iw-title' id='titleIW'>" + name + "</div><div class='iw-content'><div class='iw-subTitle'>" + info + "</div></div></div>");
				infoWindow.open(map, marker); toggleChart(name); setInfo(); 

			});
		})(marker, name, info);
	}
		markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	console.log(markerCluster);

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

function createBuildingsLegend() {
	var findDiv = document.getElementById('buildingsLegend');
	for (i = 0; i < locations.length; i++) {
		var node = document.createElement("li");
		var textnode = document.createTextNode(locations[i][0]);
		node.setAttribute('onclick', 'centerMap(' + locations[i][1] +',' + locations[i][2] + ')');
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

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
} 

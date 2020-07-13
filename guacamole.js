"use strict";

(function() {

	window.addEventListener("load", initMap);

	let initialPosition;
	let map;
	let infoWindow;
	let service;
	
	// Initializes the map and sets the center of the map to the user's location (if geolocation succeeds)
	// or Los Angeles (if geolocation fails)  
	function initMap() {  
		let lat;
		let lng;
		infoWindow = new google.maps.InfoWindow();

		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				function(position){
					lat = position.coords.latitude;
					lng = position.coords.longitude;
					initialPosition = new google.maps.LatLng(lat,lng);
					setInitialPosition();                    
				}
			)
		} else { // if geolocation fails
			initialPosition = new google.maps.LatLng(-34.397, 150.655);
			infoWindow.setPosition(initialPosition);
			infoWindow.setContent('Error: The Geolocation service failed. Might we recommend you visit Los Angeles? We hear they have a lot of guacacmole!');
			setInitialPosition();      
		}
	}    
	
	// Queries and sets up map markers
	// If it finds a Chipotle, uses the Chipotle logo as a marker
	// If it finds a Qdoba, uses the Qdoba logo as a marker
	// If it finds a store/convenience store, uses a storefront icon as a marker
	function setInitialPosition() {
		map = new google.maps.Map(document.getElementById('guac-map'), {
			center: initialPosition,
			zoom: 13
		});
		
		let marker = new google.maps.Marker({
			map: map,
			position: initialPosition,
		})
		
		google.maps.event.addListener(marker, 'click', function(){
			infoWindow.setContent("You are here!");
			infoWindow.open(map, this);
		});
		
		let store = {
			location: initialPosition,
			radius: 50000,
			type: ['convenience_store'],
			keyword: 'food'
		};
	 
		let convenienceStore = {
			location: initialPosition,
			radius: 50000,
			type: ['store'],
			keyword: 'food'
		}

		let chipotle = {
			location: initialPosition,
			radius:50000,
			type: ['restaurant'],
			keyword: 'chipotle'
		};
						
		let qdoba = {
			location: initialPosition,
			radius: 50000,
			type: ['restaurant'],
			keyword: 'qdoba'
		};

		service = new google.maps.places.PlacesService(map);
		service.nearbySearch(store, foundStore);
		service.nearbySearch(convenienceStore, foundStore);
		service.nearbySearch(chipotle, foundChipotle);
		service.nearbySearch(qdoba, foundQdoba);
	}

	// Places a storefront icon on store/convenience store locations
	function foundStore(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
		  for (let i = 0; i < results.length; i++) {
			 createMarker(results[i], "store");
		  }
		}
	}

	// Places a Chipotle logo for all the found Chipotle locations
	function foundChipotle(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (let i = 0; i < results.length; i++) {
				createMarker(results[i], "Chipotle");
			}
		}
	}

	// Places a Qdoba logo for all the found Qdoba locations
	function foundQdoba(results, status) {
		if (status !== google.maps.places.PlacesServiceStatus.OK) {
			for (let i = 0; i < results.length; i++) {
				addMarker2(results[i], "Qdoba");
			}
		}
	}

	// Given a place and a type of location, creates the necessary marker type 
	// and puts it on the map
	function createMarker(place, type) {
		let image;
		if ("store" === type) {
			image = 'https://www.iconarchive.com/download/i103468/paomedia/small-n-flat/shop.ico'
		} else if ("Chipotle" === type) {
			image = 'https://cdn.iconscout.com/icon/free/png-512/chipotle-283337.png'
		} else {
			image = 'https://brandslogo.net/wp-content/uploads/2013/04/qdoba-mexican-grill-vector-logo.png'
		}
		let marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location,
			icon: {
				url: image,
				scaledSize: new google.maps.Size(45, 45)
			}
		})
		
		google.maps.event.addListener(marker, 'click', function() {
			service.getDetails(place, function(result, status) {
			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				console.error(status);
				return;
			}
			infoWindow.setContent(result.name);
			infoWindow.open(map, marker);
			});
		});
	}
})();

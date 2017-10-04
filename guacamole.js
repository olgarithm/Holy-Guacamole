var initialPosition;
var map;
var infoWindow;
var service;
  
    function initMap() {  
        var lat;
        var lng;
        infoWindow = new google.maps.InfoWindow();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    initialPosition = new google.maps.LatLng(lat,lng);
                    setInitialPosition();                      
                }
             )
        } else {
            initialPosition = new google.maps.LatLng(-34.397, 150.655);
            infoWindow.setPosition(initialPosition);
            infoWindow.setContent(
                'Error: The Geolocation service failed. Might we recommend you visit Los Angeles? We hear they have a lot of guacacmole!');
            setInitialPosition();        
        }
    }    

    function setInitialPosition(){
        map = new google.maps.Map(document.getElementById('guac-map'), {
            center: initialPosition,
            zoom: 13
        });

        var marker = new google.maps.Marker({
            map: map,
            position: initialPosition
        })

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent("You are here!");
            infoWindow.open(map, this);
        });

        var request1 = {
            location: initialPosition,
            radius: 50000,
            type: 'convenience_store'
        };

        var request2 = {
            location: initialPosition,
            radius: 50000,
            type: 'restaurant',
            name: 'chipotle'
        };

        var request3 = {
            location: initialPosition,
            radius: 50000,
            type: 'restaurant',
            name: 'qdoba'
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request1, callback);
        service.nearbySearch(request2, callback2);
        service.nearbySearch(request3, callback3);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(place);
            }
        }
    }

    function createMarker(place){
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon:{
                url: 'http://i63.tinypic.com/ilzxg8.png',
                scaledSize: new google.maps.Size(45, 45)
            }
            })

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent(place.name);
            infoWindow.open(map, this);
        });
    }

    function callback2(results, status) {
        console.log("found chipotle");
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
        }
      
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            addMarker(place);
        }
    }

    function addMarker(place) {
        console.log("found chipotle");
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                url: 'http://i67.tinypic.com/148iy54.jpg',
                scaledSize: new google.maps.Size(45, 45)
            }
        });

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

    function callback3(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
        }
      
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            addMarker2(place);
        }
    }

    function addMarker2(place) {
        console.log("found qdoba");
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
              url: 'http://i63.tinypic.com/35jayyc.png',
              scaledSize: new google.maps.Size(50, 45)
            }
        });

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

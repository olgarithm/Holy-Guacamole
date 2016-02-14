var initialPosition;
var map;
var infoWindow;
var service;
  
    function initMap() {  
        var lat;
        var lng;
        
        infoWindow = new google.maps.InfoWindow();
        
        
        
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function(position){
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;

                    console.log(lat);
                    console.log(lng);
                    
                    initialPosition = new google.maps.LatLng(lat,lng);
                    
                    //creating the map with access
                    
                    setInitialPosition();                    
                    
                })
            } else {
                    console.log("made it into there!");
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
                position: initialPosition,
            })
            
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent("You are here!");
                infoWindow.open(map, this);
            });
            
            var request1 = {
                        location: initialPosition,
                        radius: 50000,
                        types: ['grocery_or_supermarket']
                    };
                    
                    
                    var request2 = {
                        location: initialPosition,
                        radius:50000,
                        keyword: 'chipotle'
                    };
                        
                    var request3 = {
                        location: initialPosition,
                        radius: 50000,
                        keyword: "qdoba"
                    };
                    
                    service = new google.maps.places.PlacesService(map);
                    service.nearbySearch(request1, callback);
                    service.radarSearch(request2, callback2);
                    service.radarSearch(request3, callback3);
        }

        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                console.log("we made it!!!");
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


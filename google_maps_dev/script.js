/*

var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
	// Center at UCF lat-long coordinates.  
      center: {lat: 28.602343, lng: -81.200006},
      zoom: 15
    });
  }

*/

var geocoder;
var map;
var directionsService, directionsRenderer; 

// first element is start point, second element is endpoint. 
var waypoints = new Array(2); 

function initMap() 
{
	geocoder = new google.maps.Geocoder();
	directionsRenderer = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();

	var latlng = new google.maps.LatLng(28.602343, -81.200006);
	var mapOptions = 
	{
	  zoom: 8,
	  center: latlng
	}

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	directionsRenderer.setMap(map);
}

function calculateRoute()
{
	// We assume we should get two values input into our site. 
	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;

	directionsService.route(
		{
			origin: {query: start}, 
			destination: {query: end}, 
			travelMode: 'DRIVING'
		}, 
		function(response, status)
		{
			if (status == "OK")
			{
				directionsRenderer.setDirections(response);
			}
			else
			{
				window.alert("Could not get directions due to " + status);
			}
		}

	);
}


// This function takes the input start and end values of addresses and stores 
// the appropriate LatLng values for each in our waypoints array above. 
function codeAddress() 
{
	// We assume we should get two values input into our site. 
	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;

	// Just for being able to iterate through the values. 
	var points = [start, end]

	
	// This does the geo-encoding for the start and end point addresses. 
	// We will store the results in an array for further use. 
	for (var i = 0; i < points.length; i++)
	{
		geocoder.geocode( 
			{
				'address': points[i]
			}, 

			function(results, status) 
			{
	  			if (status == 'OK') 
	  			{
	  				waypoints[i] = results[0].geometry.location;
	  				console.log(results[0].geometry.location);

			        map.setCenter(results[0].geometry.location);

			        var marker = new google.maps.Marker(
			        {
			            map: map,
			            position: results[0].geometry.location
			        });
	  			} 
	  			else 
	  			{
	    			alert('Geocode was not successful for the following reason: ' + status);
	  			}
			}
		);
	}
}

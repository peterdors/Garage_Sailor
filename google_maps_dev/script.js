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

// Globals (for now, lul)
// =====================

var geocoder;
var map;
var directionsService, directionsRenderer; 

// first element is start point, second element is endpoint. 
var waypoints = new Array(2); 

var places = [	"Oviedo, FL", "Orlando, FL", "Tampa, FL", "Cocoa Beach, FL", 
				"Windermere, FL", "Winter Haven, FL", "Boca Raton, FL", 
				"Lake Mary, FL", "Sanford, FL", "Daytona Beach, FL" ];

// Already have the starting and ending position as the same position so we have 
// one less element in the array. 
var tspWaypoints = new Array(places.length - 1);

// Build the matrix using the distance between points. 
// This builds an (N x N) matrix. 
// This is bad and should probably be put into a wrapper. 
var matrix = new Array(places.length); 
var g = new Graphs(matrix);


for (var i = 0; i < places.length; i++)
{
	matrix[i] = new Array(places.length).fill(-1);
}

// Methods
// =======

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
	// var start = document.getElementById("start").value;
	// var end = document.getElementById("end").value;

	// sleep(2.0);

	getDistances();

	// console.log(tspWaypoints);

	if (g.traversal[0] == undefined)
	{
		return;
	}

	var origAndDest = places[g.traversal[0]];

	directionsService.route(
		{
			origin: {query: origAndDest}, 
			destination: {query: origAndDest}, 
			waypoints: tspWaypoints, // array of JSON's.
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

	console.log(start);
	console.log(end);
	
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
	  				waypoints[i] = results[0];
	  				console.log(waypoints[i].formatted_address);
	  				console.log(results[0].geometry);

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

	return waypoints;
}

// Working with Google Maps Distance Matrix API. 
function sleep(secondsDelay)
{
	var now = new Date().getTime();

	// Convert seconds to milliseconds.
	var millisecondsToWait = secondsDelay * 1000;

	while (new Date().getTime() < now + millisecondsToWait)
	{
		// loopdy loop.
		// Do nothing, diddly dee daa.
	}
}

function buildTSPWaypoints(traversal, places)
{
	// Since the traversal starts and ends at the same spot, we only need the
	// points in between, i.e. the waypoints. 
	for (var i = 1; i < traversal.length - 1; i++)
	{
		tspWaypoints[i-1] = 
		{
			"location": places[traversal[i]],
			"stopover": true
		};
	}

	return tspWaypoints;
}


function getDistances()
{
	var distance = ""; 

	// Builds the adjacency matrix by getting the i'th and j'th place, then 
	// puts their distance from each other into the matrix through the 
	// getDistance() method. 
	for (var i = 0; i < places.length; i++)
	{
		for (var j = i + 1; j < places.length; j++)
		{
			getDistance(places, i, j);
		}
	}

	// Solve the problem brute forcefully. 
	g.traveling_salesman_problem();

	// Delay to allow the TSP to work. 
	sleep(2.0);

	if (g.traversal[0] == undefined)
	{
		return;
	}

	tspWaypoints = buildTSPWaypoints(g.traversal, places);

	// Just for displaying the length of the route for our TSP. 
	var routeLen = "Min Route Length: " + g.minRouteLength;
	var routeLenNode = document.createTextNode(routeLen);

	// Will want to map the traversal nodes to the list of locations so they 
	// have some meaning. This is done with the buildTraversalString method!
	var tspTraversal = "TSP traversal: " + buildTraversalString(g.traversal, places);
	var tspTraversalNode = document.createTextNode(tspTraversal);

	var nodes = [routeLenNode, tspTraversalNode]

	// Make the user press the button twice so we don't get the TSP undefined 
	// output. 
	if (g.traversal[0] != undefined)
	{
		for (var i = 0; i < nodes.length; i++)
		{
			var node = document.createElement("li");

			node.appendChild(nodes[i]);

			document.getElementById("distances-list").appendChild(node);     
		}
	}


}

function getDistance(places, start, destination)
{
	// Find the distance
	var distanceService = new google.maps.DistanceMatrixService();

	distanceService.getDistanceMatrix(
	{
		// Get and place the user input origin and destination from the website.
	    origins: [places[start]],
	    destinations: [places[destination]],
	    travelMode: google.maps.TravelMode.DRIVING,
	    unitSystem: google.maps.UnitSystem.IMPERIAL,
	    durationInTraffic: true,
	    avoidHighways: false,
	    avoidTolls: false
	},

	function (response, status) 
	{
	    if (status !== google.maps.DistanceMatrixStatus.OK) 
	    {
	        console.log('Error:', status);
	    } 
	    else 
	    {
	    	// Distance gives a text value back. 
	    	var distance = response.rows[0].elements[0].distance.text;

	    	// var text = "Distance from " + places[start] + " and " + 
	    	// 			places[destination] + " is " + distance;

	    	// Extract the floating point value from the 'distance' string 
	    	var d = parseFloat(distance)
	    	// var d = parseInt(distance)

	    	// Put the distance value in its corresponding cell in the matrix. 
	    	matrix[start][destination] = d;
	    	matrix[destination][start] = d;

	    	// Create a <li> node
			// var node = document.createElement("LI"); 

			// // Create a text node          
			// var textnode = document.createTextNode(text); 

			// // Append the text to <li>        
			// node.appendChild(textnode); 

			// // Append <li> to <ul> with id="distances-list"                   
			// document.getElementById("distances-list").appendChild(node);     
	    }
	});
}

// Takes an array of the traversal and will output the string of places based
// on the traversal. 
function buildTraversalString(traversal, places)
{
	var str = ""
	for (var i = 0; i < traversal.length; i++)
	{
		if (i == traversal.length - 1)
		{
			str += places[traversal[i]];
		}
		else
		{
			str += places[traversal[i]] + ", ";	
		}
	}

	return str;
}

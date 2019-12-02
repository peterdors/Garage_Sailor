// Garage Sailor
// COP 4331, Fall 2019

// main.js
// =======

// This will hold all of our main implementations to be called from the 
// web browser. 

// Globals used throughout the script. 
var geocoder;
var tsp, map;
var directionsService, directionsRenderer; 

// Load the saved value from the browsers local storage. 
var places = JSON.parse(localStorage.getItem("resSalesStorage"));

// Initializer function for when the SailorTerminal.html page loads. 
function initMap() 
{
	// Initialize the Google Maps API classes. 
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

	tsp = new TSP(places);
}

// Function to get the latitude & longitude values of a given address. 
// Parameters required are a string format of the (address). 
// Returns a Promise() to get the values from the geocoder object. 
function getGeocode(address)
{
	return new Promise((resolve, reject) => geocoder.geocode(
		{address: address},

		response =>
		{
			resolve(response[0].geometry.location);
		}
	));
}

// Function for building the url link to redirect the Sailor to detailed 
// directions through google maps website. 
// Returns a string format of the url. 
async function addressToLatLng(addresses)
{
	var url = "https://www.google.com/maps/dir/";

	// The length of the tsp.traversal array holds the accessible indices in the 
	// corresponding addresses array. 
	for (var i = 0; i < tsp.traversal.length; i++)
	{
		var val = await getGeocode(addresses[tsp.traversal[i]]);

		url += val.toUrlValue();
		url += "/";
	}

	return url;
}

// Function for building the JSON formatted array of waypoints to use within the 
// TSP calculations. 
// Parameters used are the calculated TSP traversal (traversal), and the array 
// of garage sale addressess (places). 
// Returns a JSON formatted array consisting of the waypoints. 
function buildTSPWaypoints(traversal, places)
{
	var tspWaypoints = new Array(places.length - 1);

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

// Function to use the Google Maps Directions Service API to outline the route
// on the map displayed in SailorTerminal.html webpage. 
// Parameters required are an instance of the TSP class instance 
function calculateRoute(tsp, waypoints)
{
	// Catch if there was an error building the TSP. 
	if (tsp == undefined || tsp.traversal[0] == undefined)
	{
		window.alert("Something went wrong, please try again.");
		location.href = "SailorPage.html";
		return;
	}

	// Calculating the outlined directions through the Google Maps Directions 
	// Service API. 
	var origAndDest = tsp.places[tsp.traversal[0]];

	directionsService.route(
		{
			origin: {query: origAndDest}, 
			destination: {query: origAndDest}, 
			waypoints: waypoints, // array of JSON's.
			travelMode: google.maps.TravelMode.DRIVING
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

// Function for resolving the loading screen overlay once the TSP and directions
// link has been calculated. 
// Returns a Promise() that the call will be completed. 
async function endLoadingScreen() 
{	
	return new Promise(resolve => {
		document.getElementById("overlay").style.display = "none";
	});
}

// Function to run everything together on the website. 
async function main()
{
	if (tsp.matrix.length < 3)
	{
		window.alert("No sales found. Try a different date or categories.");
		location.href = "SailorPage.html";
		return;
	}

	// Run the TSP class method after the TSP object is instantiated in the 
	// initMap() function above. 
	await tsp.traveling_salesman_problem();

	// Then call the buildTSPWaypoints function to use in calculateRoute(). 
	var tspWaypoints = await buildTSPWaypoints(tsp.traversal, places);
	
	// Finally, call this function with the required parameters. 
	calculateRoute(tsp, tspWaypoints);

	var url  = await addressToLatLng(places);

	document.getElementById("myUrl").href = url;

	await endLoadingScreen();
}

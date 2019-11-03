// This will hold all of our main implementations to be called from the 
// web browser. 

// Globals
// =====================
var geocoder;
var tsp, map;
var directionsService, directionsRenderer; 

var places = [	"Oviedo, FL", "Orlando, FL", "Tampa, FL", "Cocoa Beach, FL", 
				"Windermere, FL", "Naples, FL", "Boca Raton, FL", 
				"Lake Mary, FL", "Sanford, FL", "Daytona Beach, FL" ];

var places0 = ["Oviedo, FL", "Sanford, FL", "Cocoa Beach, FL", "Orlando, FL"];

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

	places = getPlaces(places);

	tsp = new TSP(places);
}

function getPlaces(places)
{
	var p = new Array(places.length);

	for (var i = 0; i < places.length; i++)
	{
		p[i] = places[i]; 
	}

	return p; 
}

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


function calculateRoute(tsp, waypoints)
{
	// We assume we should get two values input into our site. 
	// var start = document.getElementById("start").value;
	// var end = document.getElementById("end").value;

	if (tsp == undefined || tsp.traversal[0] == undefined)
	{
		return;
	}

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

function sleep(secondsDelay)
{
	var now = new Date().getTime();

	// Convert seconds to milliseconds.
	var millisecondsToWait = secondsDelay * 1000;

	while (new Date().getTime() < (now + millisecondsToWait))
	{
		// loopdy loop.
		// Do nothing, diddly dee daa.
		// I'm retarded.
	}
}

function startLoadingScreen() 
{
	console.log("Starting loading screen.");
	var overlayElem = document.getElementById('overlay').style;	

	if (overlayElem)
	{
		console.log("Overlay exists");

  	 	overlayElem.display = 'block';
	}
}

async function endLoadingScreen() 
{
	console.log("Ending loading screen.");
	
	var overlayElem = document.getElementById('overlay').style; 
	
	if (overlayElem)
	{
		console.log("Overlay exists");

  	 	overlayElem.display = 'none';
	}
}

async function main()
{
	console.log("Running TSP");

	var start = new Date().getTime();
	await tsp.traveling_salesman_problem();
	var end = new Date().getTime();

	console.log(tsp.traversal); 
	console.log(tsp.minRouteLength + " miles");
	console.log("Finished TSP in " + ((end - start) / 1000) + " seconds");

	var tspWaypoints = await buildTSPWaypoints(tsp.traversal, places);

	console.log("Calculating route.");
	
	start = new Date().getTime();
	calculateRoute(tsp, tspWaypoints);
	end = new Date().getTime();

	console.log("Finished calculating route in " + parseFloat((end - start) / 1000) + " seconds");
}

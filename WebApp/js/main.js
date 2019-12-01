// This will hold all of our main implementations to be called from the 
// web browser. 

// Globals
// =====================
var geocoder;
var tsp, map;
var directionsService, directionsRenderer; 

// TODO: parse the localStorage without relying on third-party cookie methods 
// such as JSON.parse() methods.
var places = JSON.parse(localStorage.getItem("resSalesStorage"));

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

// work in progress
// =============================================================================
const getGeocode = address =>
{
	return new Promise((resolve, reject) => geocoder.geocode(
		{address: address},

		response =>
		{
			resolve(response[0].geometry.location);
		}
	));
}

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
// =============================================================================

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

async function endLoadingScreen() 
{
	console.log("Ending loading screen.");
	
	return new Promise(resolve => {
		document.getElementById("overlay").style.display = "none";
	});
}

async function main()
{
	console.log("Running TSP");

	console.log(places);

	if (tsp.matrix.length < 3)
	{
		alert("No routes found! Press OK to reload webpage.");
		location.href = "SailorPage.html";
		return;
	}

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

	var url  = await addressToLatLng(places);

	console.log(url);

	document.getElementById("myUrl").href = url;

	await endLoadingScreen();
}

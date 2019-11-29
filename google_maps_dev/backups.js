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

	if (g.traversal[0] == undefined)
	{
		return;
	}

	// Delay to allow the TSP to work. 
	sleep(2.0);

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
	// Find the distance in miles between two points on the map. 
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

	    	// Extract the floating point value from the 'distance' string 
	    	var d = parseFloat(distance)

	    	// Put the distance value in its corresponding cell in the matrix. 
	    	matrix[start][destination] = d;
	    	matrix[destination][start] = d;
		}
	});
}

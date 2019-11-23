// This will hold the class implementation for creating an adjacency matrix 
// by using the google maps API to build the matrix with a given list of places. 

class Graph
{
	// matrix = [];
	// places = []; 
	// // Find the distance in miles between two points on the map. 
	// distanceService;

	// constructor takes in an array of places 
	constructor(places)
	{
		this.places = places; 
		this.matrix = new Array(places.length); 

		// Find the distance in miles between two points on the map. 
		this.distanceService = new google.maps.DistanceMatrixService();

		for (var i = 0; i < places.length; i++)
		{
			this.matrix[i] = new Array(places.length).fill(-1);
		}

		// Builds the adjacency matrix by getting the i'th and j'th place, then 
		// puts their distance from each other into the matrix through the 
		// get_distance() method. 
		for (var i = 0; i < places.length; i++)
		{
			for (var j = i + 1; j < places.length; j++)
			{
				// Inputs the distance in miles between the places[i] and 
				// places[j] points. Puts that in the correspoding matrix cell
				this.get_distance(places, i, j, this.ref_callback);
			}
		}
	}

	get_distance(places, start, destination, ref_callback)
	{ 
		return new Promise((resolve, reject) => this.distanceService.getDistanceMatrix(
		{
			// Get and place the user input origin and destination from the 
			// website.
		    origins: [places[start]],
		    destinations: [places[destination]],
		    travelMode: google.maps.TravelMode.DRIVING,
		    unitSystem: google.maps.UnitSystem.IMPERIAL,
		    durationInTraffic: true,
		    avoidHighways: false,
		    avoidTolls: false
		},

		response => 
		{
        	// console.log(response) // actually returns desired response
        	resolve(response.rows[0].elements[0].distance.text);
        	
        	var distance = response.rows[0].elements[0].distance.text;
        	var d = parseFloat(distance);
        	// var d = parseInt(distance);

        	this.matrix[start][destination] = d;
        	this.matrix[destination][start] = d;
      	}));
	}

	// Deprecated. 
	// ref_callback(response, status)
	// {
	// 	if (status !== google.maps.DistanceMatrixStatus.OK) 
	//     {
	//         console.log('Error:', status);
	//     } 
	//     else 
	//     {
	//     	// Distance gives a text value back. 
	//     	var distance = response.rows[0].elements[0].distance.text;

	//     	// Extract the floating point value from the 'distance' text 
	//     	var d = parseFloat(distance);
	// 	}
	// }
}

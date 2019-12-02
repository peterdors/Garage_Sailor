// Garage Sailor
// COP 4331, Fall 2019

// graph.js
// ========

// This will hold the class implementation for creating an adjacency matrix 
// by using the google maps API to build the matrix with a given list of places. 

class Graph
{
	// Constructor takes in an array of places. 
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
				// places[j] points. Putting that in the correspoding matrix 
				// cell
				this.get_distance(places, i, j);
			}
		}
	}

	get_distance(places, start, destination)
	{ 
		return new Promise((resolve, reject) => 
			this.distanceService.getDistanceMatrix(
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
        	resolve(response.rows[0].elements[0].distance.text);
        	
        	var distance = response.rows[0].elements[0].distance.text;
        	var d = parseFloat(distance);

        	// Build the matrix using the distance value we got back. 
        	this.matrix[start][destination] = d;
        	this.matrix[destination][start] = d;
      	}));
	}
}

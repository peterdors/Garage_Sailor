class GMaps extends Graphs
{
	matrix = []
	places = []
	g = undefined

	constructor(places)
	{
		this.places = places; 
		this.matrix = new Array(places.length); 

		for (var i = 0; i < places.length; i++)
		{
			this.matrix[i] = new Array(places.length).fill(-1);
		}

		// Builds the adjacency matrix by getting the i'th and j'th place, then 
		// puts their distance from each other into the matrix through the 
		// getDistance() method. 
		for (var i = 0; i < places.length; i++)
		{
			for (var j = i + 1; j < places.length; j++)
			{
				this.getDistance(places, i, j);
			}
		}

		super(this.matrix);
	}

	getDistance(places, start, destination)
	{
		// Find the distance in miles between two points on the map. 
		var distanceService = new google.maps.DistanceMatrixService();

		distanceService.getDistanceMatrix(
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

		    	// Extract the floating point value from the 'distance' text 
		    	var d = parseFloat(distance)

		    	// Put the distance value in its corresponding cell in the 
		    	// matrix. 
		    	this.matrix[start][destination] = d;
		    	this.matrix[destination][start] = d;
			}
		});
	}

} 

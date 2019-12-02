// Garage Sailor
// COP 4331, Fall 2019

// tsp.js
// ======

// The TSP class will inherit from the Graphs class in the graph.js file and 
// calculate the TSP by using the adjacency matrix constructed in the Graphs 
// class. 
class TSP extends Graph
{
	constructor(places)
	{
		super(places);

		// This will hold all the possible routes we can take. Which will 
		// be (n-1)! 
		// possible routes, where n is the number of nodes in the graph. 
		this.traversal = new Array(places.length + 1);	
		this.minRouteLength = 1e9;
	}

	async traveling_salesman_problem()
	{
		// For this problem, we will be using an adjacency matrix for input and 
		// representing the edges with their edge-weight values. We will also be 
		// representing the distance between a node and itself as -1 so to not
		// include that possibility in our implementation. 

		// Let's first try just to permute every possible path starting from the 
		// first node. That is node with index (0,0) in the adjacency matrix.
		// We will call this node A moving forward. 
		var visited = await new Array(this.matrix.length).fill(false);
		var traversal = await new Array(this.matrix.length).fill(-1);

		// The starting node we will traverse from. 
		var start = 0;

		await this.tsp_helper(start, visited, 1, 0, traversal, 0);
	}

	async tsp_helper(node, visited, numNodesVisited, routeLength, traversal, 
					level)
	{
		var totalRouteLength = this.minRouteLength; 

		for (var i = 0; i < this.matrix.length; i++)
		{
			if (!visited[i])
			{
				visited[i] = true;
				traversal[level] = i;

				if (this.matrix[node][i] == -1)
				{
					await this.tsp_helper(i, 
								visited, 
								numNodesVisited + 1, 
								routeLength, 
								traversal, 
								level + 1);
				}
				else
				{
					await this.tsp_helper(i, 
								visited, 
								numNodesVisited + 1, 
								routeLength + this.matrix[node][i], 
								traversal, 
								level + 1);
				}
				
				visited[i] = false;

				if (	
						numNodesVisited == this.matrix.length 
						&& this.matrix[node][0] != -1
					)
				{
					totalRouteLength = await routeLength + this.matrix[node][0];

					if (totalRouteLength < this.minRouteLength)
					{
						// Stupid memory referencing always gets me. We just had
						// to clone the traversed array into our class traversal.
						this.traversal = traversal.slice(0);

						// Assumes 0 is our starting position. 
						this.traversal[traversal.length] = 0;

						// Sets the new min route length for the class. 
						this.minRouteLength = totalRouteLength;
					}
				}

				// This keeps the algorithm from trying TSP on different 
				// starting nodes. 
				if (i == 0)
					return;
			}
		}
	}
}

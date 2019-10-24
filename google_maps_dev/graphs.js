// Peter Dorsaneo
// Working with graph traversals using javascript for the ultimate TSP algorithm. 

class Graphs
{
	graph = [];

	// This will hold all the possible routes we can take. Which will be (n-1)! 
	// possible routes, where n is the number of nodes in the graph. 
	traversals = [];
	minRouteLength;

	constructor(graph)
	{
		this.graph = graph; 
		this.traversal = new Array(graph.length + 1);	
		this.minRouteLength = 2e9;
	}

	factorial(n)
	{
		var res = 1; 
		for (var i = 2; i < n; i++)
		{
			res *= i;
		}

		return res;
	}

	traveling_salesman_problem()
	{
		// For this problem, we will be using an adjacency matrix for input and 
		// representing the edges with their edge-weight values. We will also be 
		// representing the distance between a node and itself as -1 so to not
		// include that possibility in our implementation. 

		// Let's first try just to permute every possible path starting from the 
		// first node. That is node with index (0,0) in the adjacency matrix.
		// We will call this node A moving forward. 
		var visited = new Array(this.graph.length).fill(false);
		var traversal = new Array(this.graph.length).fill(-1);

		// The starting node we will traverse from. 
		var start = 0;

		this.tsp_helper(start, visited, 1, 0, traversal, 0);

	}

	tsp_helper(node, visited, numNodesVisited, routeLength, traversal, level)
	{
		var totalRouteLength = this.minRouteLength; 

		for (var i = 0; i < this.graph.length; i++)
		{
			if (!visited[i])
			{
				visited[i] = true;
				traversal[level] = i;

				if (this.graph[node][i] == -1)
				{
					this.tsp_helper(i, 
								visited, 
								numNodesVisited + 1, 
								routeLength, 
								traversal, 
								level + 1);
				}
				else
				{
					this.tsp_helper(i, 
								visited, 
								numNodesVisited + 1, 
								routeLength + this.graph[node][i], 
								traversal, 
								level + 1);
				}
				
				visited[i] = false;

				// console.log(this.graph[node][0]);
				
				if (numNodesVisited == this.graph.length 
					&& this.graph[node][0] != -1
					)
				{
					totalRouteLength = routeLength + this.graph[node][0];
					// console.log(totalRouteLength);

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

	// Just a breadth first search traversal implemented in Javascript.
	bfs()
	{
		var queue = new Array();
		var visited = new Array(this.graph.length).fill(false);
		var count = 0;

		visited[0] = true;
		queue.push(0);

		while (queue.length > 0)
		{
			for (var i = 0; i < this.graph.length; i++)
			{
				if (this.graph[queue[0]][i] && !visited[i])
				{
					queue.push(i); 
					visited[i] = true;
				}
			}

			this.traversal[count++] = queue.shift();
		}
	}

	// Just for implementing a depth first search traversal in javascript. 
	recursive_dfs(node, k, visited)
	{
		visited[node] = true;
		this.traversal[k] = node;

		for (var i = 0; i < this.graph.length; i++)
		{
			if (this.graph[node][i] && !visited[i])
			{
				this.recursive_dfs(i, k+1, visited);
			}
		}
	}
	
	dfs(start)
	{
		var visited = new Array(this.graph.length).fill(false);
		
		this.recursive_dfs(start, 0, visited);
	}

	print_traversal()
	{
		console.log(this.traversal);
	}
}

// function main()
// {
// 	// TODO: Check that input file exists. 
// 	var input_file = "g7.txt";

// 	// Reads in text file of the graph. Then constructs an adjacency matrix of 
// 	// the graph. 
// 	var fs = require("fs"); // requirement. 
// 	var text = fs.readFileSync(input_file); // opens and reads the input file. 

// 	// this gives array of strings. have to remove the bad element in the array. 
// 	// that is our text file has an empty line at the end and is caught in there. 
// 	// maybe just remove that last line???
// 	var textByLine = text.toString().split("\n"); 

// 	var graphDimensions = parseInt(textByLine[0], 10);

// 	// Builds a 2d array by indicating the size of the array in the constructor
// 	// parameter. 
// 	var graph = new Array(graphDimensions);

// 	for (var i = 0; i < graphDimensions; i++)
// 	{
// 		// Here we have to parse the remainder of the line of strings. 
// 		// and coincide them with their edge weights.  
// 		graph[i] = new Array(graphDimensions).fill(-1);
// 	}

// 	var k = 0;
// 	for (var i = 1; i < textByLine.length; i++)
// 	{
// 		splitLine = textByLine[i].toString().split(' ');

// 		for (var j = 0; j < splitLine.length; j++)
// 		{
// 			graph[k][j] = parseInt(splitLine[j], 10); 
// 		}

// 		// This is for catching when we hit that bad last element in our split 
// 		// line. Our file reader may get blank lines read into it which will 
// 		// cause our for loop to go off the rails. So we use the variable 'k' to
// 		// keep track of when we should stop. 
// 		k++;
// 		if (k >= graphDimensions) break;
// 	}

// 	// Testing out class constructor and methods.
// 	let g = new Graphs(graph);
// 	g.traveling_salesman_problem();

// 	console.log("Min Route Length: " + g.minRouteLength);
// 	console.log("TSP traversal: " + g.traversal);
// }

// main();

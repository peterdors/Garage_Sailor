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
		this.minRouteLength = 1e9;
	}

	factorial()
	{
		var res = 1; 
		for (var i = 2; i < this.graph.length; i++)
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
		// visited[0] = true;
		var start = 0;
		// For now this will hold the list of nodes
		// var adjList = new Array(this.graph.length - 1).fill(-1);
		// var k = 0;

		// for (var i = 0; i < this.graph.length; i++)
		// {
		// 	if (this.graph[node][i] > -1 && !visited[i])
		// 	{
		// 		// Assign the node (i) and the edge weight (this.graph[node][i])
		// 		// to the k'th index of the adjacency list array. 
		// 		adjList[k++] = i;
		// 	}
		// }

		var traversal = new Array(this.graph.length).fill(-1);

		this.tsp_helper(start, visited, 1, 0, traversal, 0);

		// for (var i = 0; i < adjList.length; i++)
		// {
		// 	// This prints out the array of [node, edge_weight] values.
		// 	console.log(adjList[i]);
		// }
	}

	tsp_helper(node, visited, numNodesVisited, routeLength, traversal, level)
	{	
		// For now this will hold the list of nodes
		// var thisNodesAdjList = new Array(adjList.length - 1).fill(-1);
		// var thisNodesAdjList = new Array(this.graph.length).fill(-1);
		// var k = 0;

		// Fill this node's adjacency list. 
		// For reference, 'i' is the node pertaining to the graph. 
		// for (var i = 0; i < this.graph.length; i++)
		// {
		// 	if (!visited[i])
		// 	{
		// 		thisNodesAdjList[k++] = i;
		// 	}
		// }

		var totalRouteLength = this.minRouteLength; 

		for (var i = 0; i < this.graph.length; i++)
		{
			if (!visited[i])
			{
				// console.log(i);

				visited[i] = true;
				traversal[level] = i;

				if (this.graph[node][i] == -1)
					this.tsp_helper(i, 
								visited, 
								numNodesVisited + 1, 
								routeLength, 
								traversal, 
								level + 1);
				else
					this.tsp_helper(i, 
								visited, 
								numNodesVisited + 1, 
								routeLength + this.graph[node][i], 
								traversal, 
								level + 1);
				
				visited[i] = false;

				if (numNodesVisited == this.graph.length && this.graph[node][0] != -1)
				{
					totalRouteLength = routeLength + this.graph[node][0];
					// totalRouteLength = routeLength;
					// console.log(routeLength);
					
					if (totalRouteLength < this.minRouteLength)
					{
						// Stupid memory referencing always gets me. We just had
						// to clone the traversal array into this.traversal.
						this.traversal = traversal.slice(0);
						this.traversal[traversal.length] = 0;
						this.minRouteLength = totalRouteLength;
					}
				}

				// console.log(routeLength + '\n');
				// console.log();

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
		// for (var i = 0; i < this.traversal.length; i++)
		console.log(this.traversal);
	}
}

function main()
{
	

	// Reads in text file of the graph. Then constructs an adjacency matrix of 
	// the graph. 
	var fs = require("fs"); // requirement. 
	var text = fs.readFileSync("g2.txt"); // opens and reads the input file. 

	// this gives array of strings. have to remove the bad element in the array. 
	// that is our text file has an empty line at the end and is caught in there. 
	// maybe just remove that last line???
	var textByLine = text.toString().split("\n"); 

	var graphDimensions = parseInt(textByLine[0], 10);

	// Builds a 2d array by indicating the size of the array in the constructor
	// parameter. 
	var graph = new Array(graphDimensions);

	for (var i = 0; i < graphDimensions; i++)
	{
		// Here we have to parse the remainder of the line of strings. 
		// and coincide them with their edge weights.  
		graph[i] = new Array(graphDimensions).fill(-1);
	}
	
	// console.log(textByLine);

	var k = 0;
	for (var i = 1; i < textByLine.length; i++)
	{
		splitLine = textByLine[i].toString().split(' ');

		for (var j = 0; j < splitLine.length; j++)
		{
			graph[k][j] = parseInt(splitLine[j], 10); 
		}

		// This is for catching when we hit that bad last element in our split 
		// line. Our file reader may get blank lines read into it which will 
		// cause our for loop to go off the rails. So we use the variable 'k' to
		// keep track of when we should stop. 
		k++;
		if (k >= graphDimensions) break;
	}

	// console.log(graph);

	// Testing out class constructor and methods.
	let g = new Graphs(graph);
	g.traveling_salesman_problem();

	console.log("Min Route Length: " + g.minRouteLength);
	console.log("TSP traversal: " + g.traversal);

	// console.log("Depth First Search: ");
	// g.dfs(0);
	// g.print_traversal();

	// console.log("Breadth First Search: ");
	// g.bfs();
	// g.print_traversal();
}

main();

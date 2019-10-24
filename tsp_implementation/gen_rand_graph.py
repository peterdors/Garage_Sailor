import random

graph_filename = 'g7.txt'
num_nodes = 10
rand_range = 100

f = open(graph_filename, 'w')

f.write('{}\n'.format(num_nodes))

matrix = []

# This will write the first portion of the adjacency matrix representation of 
# our graph.
for i in range(num_nodes):
	matrix.append([-1 for i in range(num_nodes)])

	for j in range(i+1):
		if j == i:
			matrix[i][j] = -1
		else:
			r = random.randint(0, rand_range)
			matrix[i][j] = r
			matrix[j][i] = r


for i in range(num_nodes): 
	for j in range(num_nodes):
		if j == num_nodes - 1: 
			f.write('{}'.format(matrix[i][j]))
		else:
			f.write('{} '.format(matrix[i][j]))

	f.write('\n')


# Now we have to write the symmetric portion of the graph. 

# Making sure cleanup is done.
f.close()

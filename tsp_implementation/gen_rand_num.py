import random

def gen_rand_numbers(n):
	end = int((n * (n-1)) / 2)
	for i in range(end):
		print(random.randint(0, 5))

gen_rand_numbers(5)

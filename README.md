

# Algos

This provides a simple framework to use to implement basic algorithms. Node JS is single-threaded, we
can build efficient software to compensate. The implementation of the examples is not optimal, but is
meant to show the operation. In any case the performance gain from using an efficient algorithm
is far superior to micro-optimizations.


## Usage

### SimulatedAnnealing

When you have an problem that can't be solved for large data sets, we need some way to get to a 'good enough'
solution. After all salesmen need to travel today!

- [Detailed documentation](SimulatedAnnealing.md)
- [External Reference](https://en.wikipedia.org/wiki/Simulated_annealing)

### Backtracking
 
When the only way to find the answer seems to be by brute force: look at this. Some of the brute
force answers that don't work can be identified early. By shutting them off early - impossible 
becomes easy.

- [Detailed documentation](Backtracking.md)
- [External Reference](https://en.wikipedia.org/wiki/Backtracking)

### PriorityQueue
 
Some algorithms depend on maintaining a list of the cheapest items (esp. in graph traversal).
A priority queue is used to hold the results. This implementation uses an array, which is
kept in sorted order ( lowest is the last position in the array ). 

- [Detailed documentation](PriorityQueue.md)
- [External Reference](https://en.wikipedia.org/wiki/Priority_queue)


### Graphs

When you have list of things that are related to one another - this provides a simple framework
to borrow algorithms that have been built up over many years. 

- [Detailed documentation](Graphs.md)
- [External Reference](https://en.wikipedia.org/wiki/Graph_%28mathematics%29)
 
### Combinatorics

Helper methods to return combinations and permutations... 

- [Detailed documentation](Combinatorics.md)
- [External Reference](https://www.mathsisfun.com/combinatorics/combinations-permutations.html)
 





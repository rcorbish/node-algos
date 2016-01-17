

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
 

## Licence 

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>

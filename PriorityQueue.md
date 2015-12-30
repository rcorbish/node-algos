

# PriorityQueue

## What is a priority queue?

A priority queue stores elements and is able to quickly retrieve the smallest (lowest cost)
item. The easiest implementation would be a sorted array - each add would find the best place
in which to put the newly added item. 
 

## How it works

This implementation uses the simple sorted array method. Considering heaps, binary trees and 
other complex types (fibonacci heap); this performed very well

## General Use

Create an instance of the priority queue passing in a comparator function. If none is passed 
in the standard `function(a,b) { return a-b ; }` will be used.

## Example


```javascript

var algos = require( "../lib/algos.js" ) ;

var pq = new algos.PriorityQueue() ;
pq.add( 5 ) ;
pq.add( 2 ) ;
pq.add( 3 ) ;
pq.add( 4 ) ;
pq.add( 0 ) ;
pq.add( 7 ) ;
pq.add( 1 ) ;
console.log( pq.toString() ) ;

```

The above prints: `7,5,4,3,2,1,0`

### Future Improvements

Improve the algorithm, look at binary heaps.


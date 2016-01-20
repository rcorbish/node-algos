

# Graphs

## What are graphs?

Graphs are a means to represent relationships between elements. Common applications include cities as
elements and the relationships as a road between them. More subtle applications might include the
sequence of files to be loaded into a database, or the distribution of tasks onto a compute grid. 

There are many ways to classify graphs including:
- is the graph directed
	is a relationship one way ( useful for modeling dependencies )
	
- are the relationships weighted
	does the relationship has a cost associated ( e.g. a freeway between cities is probably a better route than a fire-trail )  

First we need to -load- or -define- our graph. This library has a simple format to store and load
from a string. [it's also possible to explicitly load bit by bit]

## Construction of the graph

### File Format
1st line is the directed or non-directed keyword. If omitted, the graph is non-directed.
subsequent lines follow this format:
1st word (space separated) is the name of a node in the graph
subsequent words define neighbours of the graph

#### Sample file ( unweighted non directed graph )
```
NON DIRECTED
A B C
B C D
C E F
G A F
E D
F E
```
Represents this ( apologies - ASCII art is not my speciality )
```	
G-----
|     \
A - B  |
| / |  |
C   D  |
| x   /
E - F
```

#### Sample file ( weighted directed graph )
```
DIRECTED
A B{1.6} C{5.7}
B C{4} D{23}
C E{17} F{5}
G A{12} F{6}
E D{12}
F E{14}
```

In the above example A is connected to B using a relationship of cost 1.6, A is also 
connected to C with a cost of 5.7.
Most of the algorithms below work for unweighted and weighted graphs: an unweighted 
graph is treated like a weighted graph where all weights are 1.0.
 
### API to create graphs

*addNode( node )*
a node is a JSON object that has a unique name within the graph. Yopu may add other attributes
to the instance
It exposes the following methods:

*addEdge( edge )*
an edge is a JSON object having from (node), to (node) and weight(number) attributes
 
*bfs*
Breadth first search. Search the graph breadth first  

*dfs*
Depth first search. Search the graph depth first
 

#### Example


This is an example of finding the shortest path. It can be used
as an example of dynamic node creation and defining the shortest path heuristic (for A*)
The console shows the route taken - so you can see the algorithm working.

```
var algos = require( '../Algos/lib/algos' ) ;

var g = new algos.Graph() ;
var X = 100 ;
var Y = 40 ;
/*
Create a graph that is a grid of horizontally and vertically connected nodes
The size of the grid is defined by the X & Y constants.
It works by creating a node named x,y - the co-ords of the node in the grid
then defining an edge from above and left to this node.

NB Graph.addEdge( e ) will create nodes if they are not present in the graph
Each edge is assigned a random weight so we get pretty pictures at the end
*/
for( var y=0 ; y<Y ; y++ ) {
	var row = [] ;
	for( var x=0 ; x<X ; x++ ) {
		var n = new algos.Node( x+","+y ) ;
		if( y>0 ) {
			var edge = { from: (x+","+y), to: (x+","+(y-1)), weight: Math.random() } ;
			g.addEdge( edge ) ;
		}
		if( x>0 ) {
			var edge = { from: (x+","+y), to: ((x-1)+","+y), weight: Math.random() } ;
			g.addEdge( edge ) ;
		}
	}	 
}

// Use no heuristics to find the best path
var start = Date.now() ;
var sp = g.shortestPath( "10,10", "70,30" );
//console.log( sp.map( function(f) { return f.name ; } ).join(' ') ) ;
console.log( "Took ", Date.now()-start, "mS." ) ;


// Now define a heuristic to speed up comparison. This is not a true
// performance test - the heuristic function is slow and memory inefficient
var h = function(a,b) { 
	var s = a.name.split(',') ;
	var t = b.name.split(',') ;
	return (t[0]-s[0]) + (t[1]-s[1]) ;  
} ;

var start = Date.now() ;
sp = g.shortestPath( "10,10", "70,30", h ) ;
//console.log( sp.map( function(f) { return f.name ; } ).join(' ') ) ;
console.log( "Took ", Date.now()-start, "mS." ) ;

// Now draw the grid - and the path we took
var hits = {} ;
for( var i=0 ; i<sp.length ; i++ ) {
	hits[sp[i]] = true ;
}

//console.log( g.toString() ) ;
for( var y=0 ; y<Y ; y++ ) {
	var row = [] ;
	for( var x=0 ; x<X ; x++ ) {
		row.push( hits[  x+","+y ] ? '▪' : '┄' ) ;
	}	
	console.log( row.join( '' ) ) ;
}

```

## General Use

First load the graphs (from text) as shown above.

The following methods are then available on the graph

*minimumSpanningTree*
Returns a minimum spanning tree for the given graph.
It uses Kruskal's algorithm which is the most reasonable
except for dense graphs with many vertices.

- [Definition](https://en.wikipedia.org/wiki/Minimum_spanning_tree)

*minimumSpanningTreePrimm*
Returns a minimum spanning tree for the given graph.
It uses Primm's algorithm which may be better in some cases than
the above implementation.


*shortestPath*
Find the shortest path from across the graph using the A* algorithm. In order to be more
efficient apply a heuristic test to see which nodes should be considered in the path. The 
heuristic should return an actual cost not greater than the actual weight sum (don't 
assume worst case). 

The path is an array of node names - an empty path implies we can't get there. 
If there is no heuristic available leave empty: the default will mean no optimizations can be applied.

- [Definition](https://en.wikipedia.org/wiki/Shortest_path_problem)


### Future Improvements

Possibly make the graphs use a more standard vertex & edge data structure.


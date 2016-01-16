
var algos = require( "./algos.js" ) ;

/**
 * Generic node used as basis of graph problems. 
 * (Nothing to do with the name: nodejs)
 * 
 * Each node has a name and (optionally) some neighbours. The name must be
 * unique within a graph.
 * 
 */
function Node( name ) {
	this.name = name ;
	this.neighbours = [] ;

	/**
	 * Simplest toString ever ...
	 */
	this.toString = function() {
		return this.name ;
	} ;

	/**
	 * We can't run multiple searches in parallel (esp on Nodejs), so we can keep
	 * the entry & exit visit times ( in clock counts ) as attributes of the node.
	 * Call this to reset the node, e.g. when we want to do another dfs on the same 
	 * graph. 
	 * See also: Graph.reset
	 */
	this.reset = function() {
		delete this.entry;
		delete this.exit ;
		delete this.isInOpen ;
		delete this.isInClosed ;
	} ;

	/**
	 * DepthFirst search, use a recursive search to scan children before siblings
	 * the node is flagged with an entry and exit clock, which can be used to
	 * determine link types (among other things)
	 * 
	 * NB if multiple dfs is run on the same node/graph call reset first.
	 * 
	 * @param cb - a function called whenever node is found function cb( aNode ) { ... }
	 */
	this.dfs = function( cb ) {
		if( !this.entry ) {			
			this.entry= Graph.globalClock++ ;
			this.neighbours.forEach( function(n) { n.to.dfs(cb) ; } ) ; 
			this.exit = Graph.globalClock++ ;
			cb( this ) ;
		}
	} ;

	/**
	 * Breadth first search, scan the tree starting with siblings before children. 
	 *   
	 * @param cb - a function called whenever node is found function cb( aNode ) { ... }
	 * 
	 */
	this.bfs = function( cb ) {
		var queue = [ this ] ;
		var pushX = function(e) { queue.push(e.to) ; } ;

		while( queue.length > 0 ) {
			var n = queue.shift() ;
			if( !n.entry ) {
				n.entry = Graph.globalClock++ ;
				cb( n ) ;
				n.neighbours.forEach( pushX ) ;
				n.exit = Graph.globalClock++ ;
			}
		}
	} ;


	/**
	 * Add a new neighbour to this node.
	 */
	this.addNeighbour = function( neighbour, weight ) {
		this.neighbours.push( { from: this, to: neighbour, weight: weight||1 } ) ;
	} ;
} 


/**
 * A Graph class.
 * 
 */
function Graph( text, directed ) {

	/**
	 * Returns a minimum spanning tree for the given graph.
	 * It uses Kruskal's algorithm which is the most reasonable
	 * except for dense graphs with many vertices.
	 * 
	 */
	this.minimumSpanningTree = function() {
		this.reset() ;
		var edges = [] ;
		var i = 1 ;	// the mst set number, we use this to track when nodes have been put into the tree

		for( var nodeName in this.nodes ) {
			if( this.nodes.hasOwnProperty(nodeName) ) {
				var node = this.nodes[nodeName] ;
				node.mstSet = i++ ; 
				for( var edge of node.neighbours ) {					
					edges.push( edge ) ;
				}
			}
		}
		var sortedEdges = edges.sort( function(a,b) { return a.weight - b.weight ; } ) ;

		var mst = new Graph( "", this.directed ) ;

		for( var edge of sortedEdges ) {
			var u = edge.from ;
			var v = edge.to ;
			if( u.mstSet !== v.mstSet ) {
				mst.addEdge( { from: edge.from.name, to: edge.to.name, weight: edge.weight } ) ;
				delete u.mstSet ;
				delete v.mstSet ;
			}
		}

		return mst ;
	} ;

	/**
	 * Find the shortest path from across the graph using the A* algorithm. In order to be more
	 * efficient apply a heuristic test to see which nodes should be considered in the path. The 
	 * heuristic should return an actual cost not greater than the actual weight sum (don't 
	 * assume worst case). 
	 * 
	 * The path is an array of node names - an empty path implies we can't get there. 
	 * If there is no heuristic available leave empty: the default will mean no optimizations can be applied.
	 *  
	 */
	this.shortestPath = function( from, to, heuristic_in ) {
		var heuristic = heuristic_in || function() { return 0 ; } ; 
		this.reset() ;
		var start = this.nodes[from] ;
		var goal = this.nodes[to] ;

		var open = new algos.PriorityQueue( function(a,b) { return a.weight - b.weight ; } ) ;
		open.add( { from: null, to: start, weight: 0 } ) ;

		var g_score = {}; // distance from start along optimal path
		var f_score = {}; // estimated distance from start to goal through node

		g_score[start.name] = 0;
		f_score[start.name] = heuristic(start, goal);

		var cameFrom = {};

		while(open.length > 0) {
			var edge = open.pop() ; // edge with lowest f score
			var node = edge.to ; // node with lowest f score

			delete node.isInOpen ;

			if(node === goal) {
				var path = [goal];
				while( cameFrom[ path[path.length-1].name ] ) {
					path.push( cameFrom[path[path.length-1].name] ) ;
				}
				return path.reverse();
			}
			node.isInClosed = true;

			var neighbours = node.neighbours;
			for(var i=0 ; i<neighbours.length ; i++) {
				var nextEdge = neighbours[i] ;
				var next = nextEdge.to ;
				if( next.isInClosed ) { continue; }
				var tentative = g_score[node.name] + nextEdge.weight  ;
				if( !next.isInOpen ) {
					next.isInOpen = true ;
					open.add( nextEdge ) ;					
				} 
				if( !g_score[next.name] || ( tentative < g_score[next.name] ) ) {					
					cameFrom[next.name] = node;
					g_score[next.name] = tentative ;
					f_score[next.name] = g_score[next.name] + heuristic(next, goal);
				}
			}
		}
		// fail
		return [];		
	} ;

	/**
	 * Add a new node to the graph. 
	 */
	this.addNode = function( node ) {
		this.nodes[node.name] = node ;
		node.graph = this ;
	} ;

	/**
	 * Add a edge: i.e. add (or make sure both ends are present)
	 * and define the link between them. If the graph is non-directed the edge is added
	 * to both nodes, otherwise only the from node has the edge defined. 
	 */
	this.addEdge = function( edge ) {		
		var f = this.nodes[edge.from] ;
		if( !f ) {
			f = new Node( edge.from ) ;
			this.addNode( f ) ;			
		}
		var t = this.nodes[edge.to] ;
		if( !t ) {
			t = new Node( edge.to ) ;
			this.addNode( t ) ;			
		}

		t.addNeighbour( f, edge.weight ) ;
		if( !this.directed ) {
			f.addNeighbour( t, edge.weight ) ;
		}
	} ;

	/**
	 * This is called to reset the flags on a node that are 
	 * used during searches. 
	 */
	this.reset = function() {
		Graph.globalClock = 1 ;
		for( var nodeName in this.nodes ) {
			if( this.nodes.hasOwnProperty(nodeName) ) {
				this.nodes[nodeName].reset() ;
			}
		}
	} ;

	/**
	 * Print out the graph so that we can re-import using new Graph( ... )
	 * 
	 * See new Graph() for details of the text format. The only thing we have
	 * to worry about is not to print reverse links when we are printing out
	 * a non-directed graph ( we only need to define A - B once )
	 * 
	 */
	this.toString = function() {
		this.reset() ;
		var printedEdges = {} ;

		var s = this.directed ? "Directed" : "Non-Directed\n" ;
		for( var nodeName in this.nodes ) {
			if( this.nodes.hasOwnProperty(nodeName) ) {
				var n = this.nodes[nodeName] ;
				var stmp = "" ;
				for( var edge of n.neighbours ) {
					if( !this.directed ) {
						var  edgeName = edge.to.name + " " + n.name ;
						if( printedEdges[ edgeName ] ) { continue ; }
						edgeName = n.name + " " + edge.to.name ;
						if( printedEdges[ edgeName ] ) { continue ; } 
						printedEdges[ edgeName ] = true ;
					}
					stmp += edge.to.name  + "{" + edge.weight + "} " ; 
				}
				if( stmp.length ) {
					s += nodeName + " " + stmp + "\n" ;
				}
			}
		}
		return s ;
	} ;

	/**
	 * Create a Graph from a String
	 * 
	 * The string is a collection of lines of text. The first line declares whether
	 * the graph is directed or not. If this is missing - the graph is non-directed
	 * Each line contains multiple elements:
	 * 	The first element names the starting node
	 *  Subsequent elements define edges (and optional weights) to neighbours
	 *  If the weight is not present it is given a value of 1.0. 
	 *  
	 *  It is not recommended to mix weighted and non-weighted edges in one graph
	 * 
	 * Full Example:
	 * 		NON_DIRECTED
	 * 		a b{2.0}
	 * 		c d a
	 * 
	 * This represents a graph where b is a  of a; a & d are adjacent to c
	 *
	 * The graph is flagged as directed by setting the (optional) second parameter 
	 * to true. 
	 */	
	this.nodes = {} ;  // hold reference to existing nodes
	if( text ) {
		var lines = text.split( "\n" ) ;
		this.directed = lines[0].toUpperCase().trim()==='DIRECTED' ;
		if( lines[0].toUpperCase().indexOf( "DIRECTED") >=0 ) {
			lines.shift() ;
		}

		for( var line of lines ) {
			var edges = line.split( /\s/ ) ;

			var from = edges.shift() ;

			for( var to of edges ) {
				var edge = { from: from } ;
				var ix0 = to.indexOf( '{' ) ;
				if( ix0 > 0 ) {
					var ix1 = to.indexOf( '}' ) ;
					var weight = Number.parseFloat( to.slice(ix0+1,ix1) ) ;
					to = to.substring(0,ix0 ) ;
					edge.weight = weight ;
				}
				edge.to = to  ;
				this.addEdge( edge ) ;
			}		
		} 
	}
} 


module.exports.Graph = Graph ;
module.exports.Node = Node ;

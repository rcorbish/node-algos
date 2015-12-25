
/**
 * a base for backtracking problems
 * 
 * Backtracking can generate all combinations of states for the problem space. 
 * However, we want to restrict the states to solutions of the problem, do this by
 * either testing whether a state satisfies the end state or (much more efficiently)
 * by only generating possible states that could lead to a solution.
 * 
 *  Subclasses (I use the term loosely in js) should define:
 *  is_solution( tests whether the solution space given is a solution )
 *  process_solution: when a solution is found do something with it
 *  construct_candidates: return a list of possible items to be added to the end of the solution space
 *  
 *  e.g. print all combinations (not permutations) where 4 numbers (1-4) are alternating odd & even
 *  
 *  <code>
 *  var algos = require( "algos" ) ;
 *   
 *  function OddEven() {
 *  this.is_solution = function( a, depth ) { 
 *  		return depth === 4 ; 
 *  } ; 
 *  this.process_solution = function( a , depth) { 
 *  		console.log( a.slice( depth).join(",") ) 
 *  };
 *  this.construct_candidates = function( a, depth ) { 
 *  		if( !a.length ) return [0,1,2,3] ; // restrict choices to prune search
 *  		if( a[depth-1] & 1 ) return [0,2] ; // is most recent item odd ? 
 *  	return [1,3] ;  
 *  } ;
 *  this.go = function() {			// start the search
 *  		this.backtrack( [], 0 ) ;
 *  	}
 *  }
 *  OddEven.prototype = new algos.Backtrack();        // Here's where the inheritance occurs 
 *  OddEven.prototype.constructor=OddEven;       // Otherwise instances of Cat would have a constructor of Mammal 
 *  var oddEven = new OddEven() ;
 *  oddEven.go() ;
 *  </code>
 */
function Backtrack() {
	this.backtrack = function( possibleSolutions, depth ) {
		if( this.is_solution( possibleSolutions, depth ) ) {
			this.process_solution( possibleSolutions, depth );
		} else {
			var candidates = this.construct_candidates( possibleSolutions, depth );
			for (var i=0; i<candidates.length; i++) {
				possibleSolutions[depth] = candidates[i];
				this.backtrack( possibleSolutions, depth+1 );
			}
		}
	} ;
}


/**
 * a base for simulated annealing algorithm
 * 
 * these kinds of problems, measure cost of the state space, random changes
 * to the state that reduce the overall cost are incorporated. Occasionally a
 * random change that increases cost is incorporated. The chance of incorporating
 * the random change that increases cost decreases as the algorithim progresses.
 * 
 * Annealing is probably a bad name - it's more like freezing, but you
 * won't get far searching for freezing algorithms!
 *
 */
function SimulatedAnnealing() {
	
	this.INITIAL_TEMPERATURE = 5000 ;
	this.COOLING_STEPS = 5000 ;
	this.COOLING_FRACTION = 0.95 ;
	this.STEPS_PER_TEMP = 1000 ;
	this.BOLTZMANNS=1.3806485279e-23; 

	this.anneal = function() {	
		
		console.log( "Annealing..." ) ;
		
		var temperature = this.INITIAL_TEMPERATURE;
		var current_solution = this.initial_solution() ;		
		var current_cost = this.solution_cost( current_solution ) ;
		var m = 0 ;
		var n = 0 ;
		for (var i=0; i<this.COOLING_STEPS; i++) {
			var start_cost = current_cost ;
			for (var j=0; j<this.STEPS_PER_TEMP; j++) {
				var new_solution = this.random_transition( current_solution ) ;
				var new_cost = this.solution_cost( new_solution ) ;
				
				if( new_cost < current_cost ) {
					current_cost = new_cost ;
					current_solution = new_solution ;
				} else {
					var minus_delta = current_cost - new_cost ;
					var merit = Math.exp( minus_delta / (this.BOLTZMANNS*temperature) ) ;
					if (merit > Math.random() ) {
						m++ ;
						current_cost = new_cost ;
						current_solution = new_solution ;
					}
				}
				n++ ;
				// exit if we're not moving
				if( start_cost === current_cost ) { break ; }
			}
			temperature *= this.COOLING_FRACTION;
		} 
		console.log( "Iterations:", n, "using", m, "jumps." ) ;
		return current_solution ;
	} ; 
}

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
	}

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
			this.neighbours.forEach( function(n) { n.dfs(cb) ; } ) ; 
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

		while( queue.length > 0 ) {
			var n = queue.shift() ;
			if( !n.entry ) {
				n.entry = Graph.globalClock++ ;
				cb( n ) ;
				n.neighbours.forEach( function(e) {	queue.push(e) ;	} ) ;
				n.exit = Graph.globalClock++ ;
			}
		}
	} ;

	/**
	 * During dfs/bfs, this is called to process an edge that runs from n1 to n2
	 */	
	this.processEdge = function( n1, n2 ) {
		if( n2.predecessor===n1 ) {
			console.log( "TREE ", n1.name, n2.name) ;
		} else if( n2.entry && !n2.exit ) {
			console.log( "BACK ", n1.name, n2.name) ;
		} else {
			console.log( "UNKN ", n1.name, n2.name) ;
		}
	}

	/**
	 * Add a new neighbour to this node.
	 */
	this.addNeighbour = function( child ) {
		this.neighbours.push( child ) ;
	} ;

	/**
	 * Add multiple neighbours to this node
	 */
	this.addNeighbours = function( others ) {
		this.neighbours.concat( others ) ; 
	} ;
} 

/**
 * Create a node and all of its adjacent nodes from a string.
 * 
 * 
 * The string is a collection of lines of text. The first element names the 
 * node all subsequent nodes are adjacent to the first element.
 * 
 * Example:
 * 		a b
 * 		c d a
 * 
 * This represents a graph where b is a  of a; a & d are adjacent to c
 *
 * The graph is flagged as directed by setting the (optional) second parameter 
 * to true. 
 */
function Graph( text, directed ) {
	this.nodes = {} ;  // hold reference to existing nodes

	this.directed = directed || false ;

	for( var line of text.split( "\n" ) ) {
		var nodeNames = line.split( /\s/ ) ;
		// get the main node (first item in the row)
		// we'll add all subsequent names as neighbours
		var currentNodeName = nodeNames.shift() ;
		var currentNode = this.nodes[currentNodeName] ;
		if( !currentNode ) {
			currentNode = new Node( currentNodeName ) ;
			this.nodes[currentNodeName] = currentNode ;
		}
		// No we're processing all other nodes on the row
		// to be added as neighbours.
		for( var nodeName of nodeNames ) {
			var adjacentNode = this.nodes[nodeName] ;
			if( !adjacentNode ) {
				adjacentNode = new Node( nodeName ) ;
				this.nodes[nodeName] = adjacentNode ;
			}

			currentNode.addNeighbour( adjacentNode ) ;
			if( !directed ) {
				adjacentNode.addNeighbour( currentNode ) ;
			}			
		}
	} ;

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
		var printedNodes = [] ; 

		var s = "" ;
		for( var nodeName in this.nodes ) {
			if( this.nodes.hasOwnProperty(nodeName) ) {
				var n = this.nodes[nodeName] ;
				s += nodeName + " " ;
				if( !this.directed ) { // undirected don't repeat reversed labels
					for( var neighbouring of n.neighbours ) {
						var ix = printedNodes.indexOf( neighbouring ) ;
						if( ix<0 ) { 
							s += neighbouring  + " " ; 
							printedNodes.push( n ) ;
						}
					}
				} else { // if it's a directed graph print all associations
					s += n.neighbours.join( " " ) ;
				}
				s += "\n" ;
			}
		}
		return s ;
	}
} 




module.exports.Backtrack = Backtrack ;
module.exports.Graph = Graph ;
module.exports.Node = Node ;
module.exports.SimulatedAnnealing = SimulatedAnnealing ;
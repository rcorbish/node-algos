
/**
 * A priority queue implemented using a sorted list. There are 
 * methods to add, pop and change an item.
 * The comparison operator should be passed in as a function.
 * 
 */
function PriorityQueue( comparator_in ) {
	var list = [] ;
	var comparator = comparator_in || function(a,b) { return a-b ;} ;

	this.length = 0 ;
	this.toString = function() { return list.toString() ; } ; 

	this.change = function( item ) {
		var n = findItemIndex( item ) ;
		if( item===list[n] ) {
			list.splice( n,1 ) ;
			this.add( item ) ;
		}
	} 
	this.pop = function() {
		if( this.length <= 0 ) throw new Err( "The queue is empty." ) ;
		this.length -- ;
		return list.splice( list.length-1, 1 )[0] ;
	}

	this.best = function() {
		if( this.length <= 0 ) throw new Err( "The queue is empty." ) ;
		this.length -- ;
		return list[ list.length-1 ] ;
	}

	this.add = function( item ) {
		this.length ++ ;
		var n = findItemIndex( item ) ;
		list.splice( n, 0, item ) ;
	}

	var findItemIndex = function( item ) {
		var lower = 0 ;
		var upper = list.length ;
		var mid = 0 ; 

		while( lower < upper ) {		
			mid = lower + ( ( upper - lower ) >> 1 ) ;
			var comparisonResult = comparator( list[mid], item ) ;

			if( comparisonResult < 0 ) {
				upper = mid ;
			} else if( comparisonResult > 0 ) {
				lower = mid + 1;
			} else {
				return mid ;
			}
		}
		return lower ;
	}
}


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

var graph = require( "./graph.js" ) ;
var combs = require( "./combs.js" ) ;
module.exports.Graph = graph.Graph ;
module.exports.Node = graph.Node ;
module.exports.Backtrack = Backtrack ;
module.exports.SimulatedAnnealing = SimulatedAnnealing ;
module.exports.PriorityQueue = PriorityQueue ;
module.exports.Combs = combs.Combs ;

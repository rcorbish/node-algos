

# Algos

This provides a simple framework to use to implement basic algorithms. Node JS is single-threaded, we
can build efficient software to compensate.


## Usage

### SimulatedAnnealing

When you have an problem that can't be solved for large data sets, we need some way to get to a 'good enough'
solution. After all salesmen need to travel today!

### Backtracking
 
When the only way to find the answer seems to be by brute force: look at this. Some of the brute
force answers (avenues) just can't work. By shutting them off early - impossible becomes easy.

###Graphs

When you have list of things that are related to one another - this provides a simple framework
to borrow algorithms that have been built up over many years. 
 
## Examples

Look at tests/tests.js for some examples

### SimulatedAnnealing
For this example we'll do a bucket fill. The problem is to put items into a set of bins  so that each 
bin has about the same amount. anytime you may ask "How do I share things evenly?" this may be of interest.

Note the actual source code has more detail, this is a simple introduction.

For BinPacking we subclass ( as best as we can in javascript ) the SimulatedAnnealing function

```javascript

/**
	define the BinPacking class, it takes an argument the number of bins to fill up
*/
function BinPacking( numBins ) {
	this.numBins = numBins ;						// keep the arg - we'll use it frequently 
	
	this.initial_solution = function() {		// Initial solution function defines the starting state
		var bins = [] ;
		for( var i=0 ; i<numBins ; i++ ) {
			bins[i] = [ i, i, i, i, i, i ] ;
		}
		return bins ;
	}
	
	/**
		how much does a solution cost
	*/
	this.solution_cost = function( solution ) {		
		var rc = 0 ;
		for( var i=0 ; i<numBins ; i++ ) {
			var binTotal = 0 ;
			for( j=0 ; j<solution[i].length ; j++ ){
				binTotal += solution[i][j] ;
			}
			rc = Math.max( rc,binTotal) ;
		}
		return (1+rc) * (1+rc)  ;
	}
	
	/**
		Make a random transition - in our case we'll swap an item
		between one bin and another at random. 
		We do return the new solution
	*/
	this.random_transition = function( solution ) {
		var rc = solution.slice( 0 );
        for( i = 0; i < rc.length; i++ ) {
            rc[i] = solution[i].slice(0) ;
        }
		var bin1  = Math.floor( Math.random() * numBins ) ;
		var bin11 = Math.floor( Math.random() * solution[bin1].length ) ;
		var bin2 = Math.floor( Math.random() * numBins ) ;
		var bin21 = Math.floor( Math.random() * solution[bin2].length ) ;

		rc[bin1][bin11] = solution[bin2][bin21] ;
		rc[bin2][bin21] = solution[bin1][bin11] ;
		
		return rc ;
	}
	/**
		This is purely for niceness/debugging. It's not part of the
		actual annealing
	*/
	this.printSolution = function( solution ) {
		return solution.map( function(e) { return e.reduce( function(p,c){ return p+c ;} )}).join( " " ) ;
	}
}
```

var algos = require( "algos" ) ;

BinPacking.prototype = new algos.SimulatedAnnealing();  // Here's where the "inheritance" occurs 
BinPacking.prototype.constructor=BinPacking;       		

var testBinPacking = new BinPacking( 30 ) ;
var result = testBinPacking.anneal()  ;
console.log( result.join( ",") ) ; 


### Tools


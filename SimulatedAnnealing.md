

# SimulatedAnnealing

## How does annealing work?
We know about 'greedy' algorithms - that make the best short-term decisions. Sometimes 
greed gets us stuck where we're too afraid to take a risk and go 'the wrong way'. SimulatedAnnealing
provides a statistical test that says we need to make an apparent bad decision: in order to get out 
of a rut. It's a heuristic that work rather well in many situations.

## How it works

The solution state is repeatedly changed if a new state has lower energy, it will be accepted as the
new solution. This way we are constantly improving the solution. However we can get stuck, sometimes
we need to jump to an intermediate, higher energy state in order to progress. The decision on whether
to permit a jump to the higher energy state mirrors a physical system: freezing of a liquid. As the
liquid cools, the ability to readjust the molecules to form crystals is extremely limited.

### Pseudocode
This is not the best algorithm to use, but it shows the basic principal.

```

for T = 1000 to 0 step -1
	current_energy = current_state.calculate_energy
	new_state = do_a_random_state_change
	new_energy = new_state.calculate_energy
	delta = new_energy - current_energy  
	if new_energy < current_energy
		current_state = new_state			// lower energy ( aka greedy decision )
	else if ( e ** (-delta / kT) ) < random ( 0.0..1.0 ) 
		current_state = new_state			// if delta is so bad - we may randomly accept it
```	

## General Use

The SimulatedAnnealing is designed as an abstract class (in other language terms). The class
 has 3 highlighted methods that should be implements:

- initial_solution: returns a solution object that is the starting state. This is called only once
- random_transition: takes a solution and returns a new solution that has been randomly changed
- solution_cost: takes a solution and returns the energy cost of that solution

It is important to figure out a good cost metric for your solution space. For example a "traveling salesman"
might well use the path length. 

There are several constants (e.g. `INITIAL_TEMPERATURE`) defined in the code. Play with the constants in the code to tweak the convergence.

## Example

[Bin Packing](https://en.wikipedia.org/wiki/Bin_packing_problem) is a problem which puts items into a set of bins, so that each bin has about the same total amount. Anytime you may ask "How do I share things evenly?" this may be of interest.

For BinPacking we subclass ( as best as we can in javascript ) the SimulatedAnnealing function

```javascript

/**
	define the BinPacking class, it takes an argument: the number of bins to fill up
*/
function BinPacking( numBins ) {
	this.numBins = numBins ;						 
	/**
	Initial solution function defines the starting state. This is just something 
	silly for testing.
	*/
	this.initial_solution = function() {		
		var bins = [] ;		// this is the solution state
		for( var i=0 ; i<numBins ; i++ ) {
			bins[i] = [ i, i, i, i, i, i ] ;
		}
		return bins ;
	}
	
	/**
		how much does a solution cost. Make sure you have a 
		metric that measures the effective energy of a solution
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
		Make a random transition - in our case swap an item
		between one bin and another. For large scale solution states
		a better random number generator is recommended (It really is 
		important).
		 
		Return the new solution
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

Now we have a function to use (see above). Let's test it out. Pretty simple :)

```javascript
var algos = require( "algos" ) ;		// npm install algos 

BinPacking.prototype = new algos.SimulatedAnnealing();  // Here's where the "inheritance" occurs 
BinPacking.prototype.constructor=BinPacking;       		

var testBinPacking = new BinPacking( 30 ) ;			// 30 bins of random test data
var result = testBinPacking.anneal()  ;				// sort the bins evenly
console.log( result.join( ",") ) ; 					// log the result
```

### Tools


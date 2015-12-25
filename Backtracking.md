

# Backtracking

## What is backtracking?

Backtracking is proceeding along a possible solution until we discover it has failed, then backtracking 
to a previous decision to attempt a different route. If we can build up a solution in pieces this is probably 
something to consider (e.g. solving a maze: the first step in the solution is the entrance, each decision
represents a turn in the maze, the solution is found then the next step is the exit). 
 

## How it works

We build a solution step by step; each step involves choices, all _possible_ choices are tried. As soon
as we discover the solution is not possible we *backtrack* to the most recent decision and select the
next _possible_ option. This enables us to limit a full permutation [O(n!)] search to something less.
Although we can use the same algorithm to create all permutations is we wanted to. Also, we can 
choose to exit after one solution or continue to search for more solutions


### Pseudocode

```
	def function backtrack( possible_solution, step )	
		if is_a_complete_solution( possible_solution )
			process_valid_solution( possible_solution ) 
		else 
			next_candidates = construct_candidates( possibleSolution, step )
			for candidate in next_candidates 
				possibleSolution.set_next_step( step, candidate )
				backtrack( possible_solution, step+1 )
			}
		}
```	

## General Use

The Backtracking is designed as an abstract class (in other language terms). The class
 has 3 highlighted methods that should be implements:

- is_solution: determine whether we have finished all steps
- construct_candidates: provide a list of steps to append to the current solution
- process_solution: when we found a valid solution do something

To make things efficient - use construct_candidates to limit to only valid next steps. Do not 
rely on is_solution to do complex checking.

## Example

[The Queens Problem](https://en.wikipedia.org/wiki/Eight_queens_puzzle) is a problem to place 8 queens
on a chessboard so none of them directly attack another.

For Queens we subclass ( as best as we can in javascript ) the Backtracking function

```javascript

function Queens( board_size ) {

	this.numSolutions=0 ;	// we'll keep this to count the solutions
	
	this.is_solution = function( a, k ) {
		return k === this.boardSize ;	// as soon as we have completed all 8 rows we're done 
	}

	// choose all possible steps where we can put a queen
	// such that none of the previously placed queens can 'attack' the new
	// one. If there are none - return the empty array
	this.construct_candidates = function( a, k ) {	
		var c = [] ;
		for( var j=0 ; j<this.boardSize ; j++ ) {
			c.push(j) ;
		}
		// Compare each column in the new row against the attack paths of previously placed queens
		for( var i=0 ; i<k ; i++ ) {
			var index = c.indexOf( a[i] );
			if (index > -1) {
				c.splice(index, 1);
			}
			index = c.indexOf( a[i]-(k-i) );
			if (index > -1) {
				c.splice(index, 1);
			}
			index = c.indexOf( a[i]+(k-i) );
			if (index > -1) {
				c.splice(index, 1);
			}
		}

		return c ;
	}

	// We just increment a counter
	this.process_solution=function( a, k ) {
		this.numSolutions++ ;
	}
	
	// at construction we auto-start the backtracking ...
	var a=[] ;
	this.boardSize=board_size ;
	this.backtrack( a, 0 ) ;
}
```

Now we have a function to use (see above). Let's test it out. Pretty simple :)

```javascript
var algos = require( "algos" ) ;		// npm install algos 

Queens.prototype = new algos.Backtrack();        // Here's where the inheritance occurs 
Queens.prototype.constructor=Queens;

var q = new Queens( 8 ) ;
console.log( q.numSolutions ) ;
   
```

### Future Improvements



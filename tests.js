
var algos = require( "./algos.js" ) ;

//S I M U L A T E D  A N N E A L I N G
//S I M U L A T E D  A N N E A L I N G
//S I M U L A T E D  A N N E A L I N G

function BinPacking( numBins ) {
	this.numBins = numBins ;
	this.initial_solution = function() {
		var bins = [] ;
		for( var i=0 ; i<numBins ; i++ ) {
			bins[i] = [ i, i, i, i, i, i ] ;
		}
		console.log( this.printSolution( bins ) ) ;
		return bins ;
	}
	
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
	
	this.printSolution = function( solution ) {
		return solution.map( function(e) { return e.reduce( function(p,c){ return p+c ;} )}).join( " " ) ;
	}

}
BinPacking.prototype = new algos.SimulatedAnnealing();  // Here's where the inheritance occurs 
BinPacking.prototype.constructor=BinPacking;       		// Otherwise instances of Cat would have a constructor of Mammal 
var testBinPacking = new BinPacking( 30 ) ;

var result = testBinPacking.anneal()  ;
console.log( testBinPacking.printSolution( result ) ) ; 

return ;



//B A C K T R A C K I N G
//B A C K T R A C K I N G
//B A C K T R A C K I N G


//==============================
//C O M B I N A T I O N S
//==============================
function Combinations( numDigits ) {
	this.numSolutions=0 ;
	this.is_solution = function( a, k ) {
		return k === this.num_digits ;
	}

	this.construct_candidates = function( a, k ) {
		var c = [ true, false ] ;
		return c ;
	}

	this.process_solution=function( a, k ) {
		var tmp = [] ;
		for( var i=0; i< k ; i++ ) {
			if( a[i] )  tmp.push( i ) ;
		}
		console.log( tmp.join( "," ) );
	}

	this.a=[] ;
	this.num_digits=numDigits;
	this.backtrack( this.a, 0 ) ;
}

Combinations.prototype = new algos.Backtrack();        // Here's where the inheritance occurs 
Combinations.prototype.constructor=Combinations;       // Otherwise instances of Cat would have a constructor of Mammal 
var testCombinations = new Combinations( 4 ) ;

//===================================
//N   Q U E E N S
//===================================
function Queens( board_size ) {

	this.numSolutions=0 ;
	this.is_solution = function( a, k ) {
		return k === this.boardSize ;
	}

	this.construct_candidates = function( a, k ) {
		var c = [] ;
		for( var j=0 ; j<this.boardSize ; j++ ) {
			c.push(j) ;
		}

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

	this.process_solution=function( a, k ) {
//		console.log( "SOLUTION", a.join( " " ) ) ;
		this.numSolutions++ ;
	}

	var a=[] ;
	this.boardSize=board_size ;
	this.backtrack( a, 0 ) ;
}


Queens.prototype = new algos.Backtrack();        // Here's where the inheritance occurs 
Queens.prototype.constructor=Queens;       // Otherwise instances of Cat would have a constructor of Mammal 

var queensAnswers = [ 0, 1,0,0,2,10,4,40,92,352 ] ;
for( var i=1 ; i<10 ; i++ ) {
	var testQueens = new Queens( i ) ;
	if( queensAnswers[i] === testQueens.numSolutions ) {
		console.log( "PASS", i, testQueens.numSolutions, "solutions found." ) ;
	} else {
		console.log( "FAIL", i, testQueens.numSolutions, "solutions found, should be", queensAnswers[i] ) ;
	}
}

var start = Date.now() ;
var testQueens = new Queens( 12 ) ;
var delta = Date.now() - start ;
console.log( "12 Queens in", delta, "mS." ) ;



function OddEven() {
	this.is_solution = function( a, depth ) { 
		return depth === 4 ; 
	} ; 
	this.process_solution = function( a, depth ) { 
		console.log( a.join(",") ) 
	};
	this.construct_candidates = function( a, depth ) { 
		if( !a.length ) { return [0,1,2,3] ; } 
		if( 1 & a[depth-1] ) {
			var rc = [] ;
			if( a.indexOf( 0 ) < 0 ) rc.push( 0 ) ; 
			if( a.indexOf( 2 ) < 0 ) rc.push( 2 ) ; 
			return rc ;
		} ;
		
		var rc = [] ;
		if( a.indexOf( 1 ) < 0 ) rc.push( 1 ) ; 
		if( a.indexOf( 3 ) < 0 ) rc.push( 3 ) ; 
		return rc ;
	} ;
	this.go = function() {
		this.backtrack( [], 0 ) ;
	}
}
OddEven.prototype = new algos.Backtrack();        // Here's where the inheritance occurs 
OddEven.prototype.constructor=OddEven;       // Otherwise instances of Cat would have a constructor of Mammal 
var oddEven = new OddEven() ;
oddEven.go() ;

//	G R A P H S
//	G R A P H S
//	G R A P H S

	var graph = new algos.Graph( "A B C\nB C D\nC E F\nG A F\nE D", true ) ;
	graph.reset() ;
	console.log( graph.toString() ) ;

	console.log( "\nDFS:" ) ;
	var stack=[] ;
	graph.nodes.G.dfs( function(n) { stack.push(n) } ) ;
	console.log( stack.reverse().map( function(n) { return n.name ;} ) ) ;

	console.log( "\nBFS:" ) ;
	graph.reset() ;
	graph.nodes.G.bfs( function(n) { console.log(n.name) ; } ) ;

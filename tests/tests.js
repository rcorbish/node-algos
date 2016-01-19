


var algos = require( "../lib/algos.js" ) ;

var g = new algos.Graph() ;
var X = 100 ;
var Y = 20 ;

var w = 0 ;
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
var h = function(a,b) {
    var s = a.name.split(',') ;
    var t = b.name.split(',') ;
    return (t[0]-s[0]) + (t[1]-s[1]) ;
} ;

var sp = g.shortestPath( "8,8", (X-8)+","+(Y-8), h ) ;
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

var start = Date.now() ;
var mst = g.minimumSpanningTree() ;
//console.log( "MST:\n", mst.toString() )
var delta = Date.now() - start ;
console.log( "MST in", delta, "mS." ) ;

var edgeSet = [ ' ', '╵', '╶', '└', 
                '╷', '│', '┌', '├',
                '╴', '┘', '─', '┴',
                '┐', '┤', '┬', '┼'	] ; 
for( var nodeName of Object.keys(mst.nodes) ) {
	var node = mst.nodes[nodeName] ;
	for( var edge of node.neighbours ) {
		var f = edge.from ;
		var t = edge.to ;
		if( f<t ) { edgeSet[f+'-'+t] = true ; } 
		else      { edgeSet[t+'-'+f] = true ; } 		
	}
} 
//console.log( "MST-LEN:", Object.keys( edgeSet ).join(' - ' ) ) ;

var connectionCharacters = []
for( var y=0 ; y<Y ; y++ ) {
    var row = [] ;
    for( var x=0 ; x<X ; x++ ) {
    		var n = mst.nodes[ x+","+y ] ;
    		var mask = 0 ;
    		var N = x+","+(y-1)  ;
    		var S = x+","+(y+1)  ;
    		var W = (x-1)+","+y  ;
    		var E = (x+1)+","+y  ;
    		for( var neighbour of n.neighbours ) {
    			if( neighbour.to.name === N ) { mask |= 1 ; }
    			if( neighbour.to.name === E ) { mask |= 2 ; }
    			if( neighbour.to.name === S ) { mask |= 4 ; }
    			if( neighbour.to.name === W ) { mask |= 8 ; }
    		}
            row.push( edgeSet[mask] ) ;
    }
    console.log( row.join( '' ) ) ;
}
console.log( "MST-LEN:", Object.keys( edgeSet ).length ) ;
return 

var x0 = algos.secantSolver( function(x) { return Math.exp(x/100) - (3.0*x*x*x) / x*x - 7.5 ; }, 10 ) ;
//var x0 = algos.secantSolver( function(x) { return 12*x*x*x - 200*x*x -15  ; }, 100 ) ;
console.log( x0 ) ;

var x0 = algos.bisectionSolver( function(x) { return Math.exp(x/100) - (3.0*x*x*x) / x*x - 7.5 ; }, 10 ) ;
//var x0 = algos.secantSolver( function(x) { return 12*x*x*x - 200*x*x -15  ; }, 100 ) ;
console.log( x0 ) ;

return 

var c = algos.Combs ;
console.log( c.combinations( 16,3  ) ) ;
console.log( c.combinationsRepeat( 5,3  ) ) ;
console.log( c.permutations( 5,3  ) ) ;
console.log( c.permutationsRepeat( 5,3  ) ) ;

var a = [1,2,3] ;
console.log( a.join( ',' ) ) ;
while( c.nextPermutation(a) ) {
	console.log( a.join( ',' ) ) ;
}
return 

var pq = new algos.PriorityQueue() ;
pq.add( 5 ) ;
pq.add( 2 ) ;
pq.add( 3 ) ;
pq.add( 4 ) ;
pq.add( 0 ) ;
pq.add( 7 ) ;
pq.add( 1 ) ;
console.log( pq.toString() ) ;

var graph = new algos.Graph( "A B C\nB C D\nC E F\nG A F\nE D\nF E", true ) ;
graph.reset() ;
//console.log( graph.toString() ) ;
var mst = graph.minimumSpanningTree() ;
console.log( "MST:\n", mst.toString() ) ;

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
console.log( "Bin packing test - make bins alomst as full as each other.") ;

BinPacking.prototype = new algos.SimulatedAnnealing();  // Here's where the inheritance occurs 
BinPacking.prototype.constructor=BinPacking;       		 
var testBinPacking = new BinPacking( 20 ) ;
var initial_solution = testBinPacking.initial_solution() ;

var mx1 = initial_solution.map( function(e) { return e.reduce( function(p,e) { return e+p ;	}) ; })
						  .reduce( function(p,e) { return Math.max(p,e) ; }, 0 ) ;
console.log( "BEFORE [max bin:", mx1, "]", testBinPacking.printSolution( initial_solution ) ) ;

var result = testBinPacking.anneal()  ;
var mx2 = result.map( function(e) { return e.reduce( function(p,e) { return e+p ;	}) ; })
				.reduce( function(p,e) { return Math.max(p,e) ; }, 0 ) ;
console.log( "AFTER  [max bin:", mx2, "]", testBinPacking.printSolution( result ) ) ;


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
Combinations.prototype.constructor=Combinations;        
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
Queens.prototype.constructor=Queens;       

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

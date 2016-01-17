
var algos = require( "./algos.js" ) ;

function secantSolver( func, xstart ) {

	var x0 = xstart || 1 ;
	var x1 = x0 + ( (x0>0) ? -0.1 : 0.1 ) ;
	var fx0 = func(x0) ;
	var fx1 = func(x1) ;

	var n = 0 ;
	do { 
		var x2 = x1 - fx1 * ( x1 - x0 ) / ( fx1 - fx0 ) ;
		x0 = x1 ;
		x1 = x2 ;
		fx0 = fx1 ;
		fx1 = func(x1) ;		
		if( ++n > 10000 ) {
			throw new Error( "Function " + func + " is not converging." ) ;
		}
	} while( Math.abs(x1-x0) > 1e-9 ) ;

	return x0 ;
}


function bisectionSolver( func, xstart, xend ) {

	var a = xstart ||  10000 ;
	var b = xend   || -11000 ;
	if( a>b ) {
		var t = a ;
		a = b ;
		b = t ;
	}
	var n = 0 ;
	var fm ;
	var m = null ;
	
	do {
		m = ( a + b ) / 2 ;
		fm = func( m ) ;
		var fa = func( a ) ;

		if( Math.sign(fm) === Math.sign(fa) ) {
			a = m ;
		} else {
			b = m ;
		}
		if( ++n > 10000 ) {
			throw new Error( "Function " + func + " is not converging." ) ;
		}
	} while( Math.abs(fm) > 1e-9 ) ;
	return m ;
}

module.exports.bisectionSolver = bisectionSolver ;
module.exports.secantSolver = secantSolver ;


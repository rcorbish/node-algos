
var algos = require( "./algos.js" ) ;
		

/**
 * Helper class for combinations and permutations. No need to create one of these
 * just use the methods directly.
 */
function Combs() {

	/**
	 * Integer factorial. Inputs must be positive integers
	 */
	function factorial(n) {
		var rc = 1 ;  // 0 & 1 factorials are both 1
		for( var i=2 ; i<=n ; i++ ) {
			rc *= i ;
		}
		return rc ;
	}

	/**
	 * Combinations. Maybe called nCr. How many combinations
	 * of choosing r items from a set of n. Items cannot be repeated
	 * once chosen. 
	 * 
	 * e.g. possibilities of picking 6 numbers from a lottery of 50 numbers
	 * This is also known as the Binomial Coefficient
	 */
	this.combinations = function( n, r ) {
		if( ( n-r ) > r ) { 	// optimization due to binomial symmetry
			return this.permutations(n, r) / factorial( r )  ;
		}
		return this.permutations(n, n-r) / factorial( n-r )  ;
	} ;

	/**
	 * Combinations. How many combinations of choosing r items from a set 
	 * of n where an item n may be repeated.
	 * 
	 * e.g. How many combinations of 5 coins ( coins may be repeated ) 
	 */
	this.combinationsRepeat = function( n, r ) {
		return  this.combinations( r+n-1, n-1 ) ;
	} ;


	/**
	 * Permutations. Maybe called nPr. How many different ways
	 * of choosing r items from a set of n. Once an items has
	 * been chosen from the set it may not be rechosen. 
	 * e.g. The order of children in line for recess 
	 * The order of items is important
	 */
	this.permutations = function( n, r ) {
		return factorial(n) / factorial( n-r ) ;
	} ;

	/**
	 * How many ways to choose r items from a set of n items - such
	 * that n can be replenished. 
	 * e.g. different ice-creams permutations when choosing any 3 scoops out of 43 buckets. 
	 * Order is important.
	 */
	this.permutationsRepeat = function( n, r ) {
		return Math.pow( n, r ) ;
	} ;

	/**
	 * This takes an array 'a' and reorders it to provide the next
	 * permutation in the sequence until there is no longer a nex
	 * permutation. It relies on a comparison function 'f'. If the 
	 * function is missing it is assumed to be '>'.
	 * The array should be sorted to the smallest value before 
	 * calling this the first time. 
	 */
	this.nextPermutation = function( a, f ) {
		var comparator = f || function(a,b) { return a-b ; }
		
		// Find longest non-increasing suffix
		var i = a.length - 1;
		while(i > 0 && comparator( a[i-1], a[i] ) > 0 )
			i--;
		// Now i is the head index of the suffix

		// Are we at the last permutation already?
		if (i <= 0)
			return false;

		// Let array[i - 1] be the pivot
		// Find rightmost element that exceeds the pivot
		var j = a.length - 1;
		while( comparator(a[j], a[i-1]) < 0 ) 
			j--;
		// Now the value array[j] will become the new pivot
		// Assertion: j >= i

		// Swap the pivot with j
		var temp = a[i - 1];
		a[i - 1] = a[j];
		a[j] = temp;

		// Reverse the suffix
		j = a.length - 1;
		while (i < j) {
			temp = a[i];
			a[i] = a[j];
			a[j] = temp;
			i++;
			j--;
		}

		// Successfully computed the next permutation
		return true;
	}		
}

module.exports.Combs = new Combs() ;


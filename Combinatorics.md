

# Combinatorics

## What are combinations & permutations ?

When counting the ways to choose *r* items from a set of *n* items we have 2 choices to make before we can answer:
- does the order of selection matter
	- if order is important use permutations
	- if order is not meaningful use combinations	 
- can we repeat items from the set
	- if items may be pulled from the set repeatedly choose the repeat option of the methods


## General Use

include the Combs export from the algos package. This is a singleton class - call its methods
Below are the method definitions...


```combinations( n, r )```
Combinations. Maybe called nCr. How many combinations
of choosing r items from a set of n. Items cannot be repeated
once chosen. This is the root of most combinatorics.
e.g. possibilities of picking 6 numbers from a lottery of 50 numbers
This is also known as the Binomial Coefficient


```combinationsRepeat( n, r )```
How many combinations of choosing r items from a set 
of n where an item n may be repeated.
e.g. How many combinations of 5 coins ( coins may be repeated ) 


```permutations( n, r ) ```
Permutations. Maybe called nPr. How many different ways
of choosing r items from a set of n. Once an items has
been chosen from the set it may not be rechosen. 
e.g. The order of children in line for recess 
The order of items is important


```permutationsRepeat( n, r )```
How many ways to choose r items from a set of n items - such
that n can be replenished. 
e.g. different ice-creams permutations when choosing any 3 scoops out of 43 buckets. 
Order is important.


```nextPermutation( a, f )```
This takes an array 'a' and reorders it to provide the next
permutation in the sequence until there is no longer a nex
permutation. It relies on a comparison function 'f'. If the 
function is missing it is assumed to be '>'.
The array should be sorted to the smallest value before 
calling this the first time. 

## Example

```
var algos = require( "algos" ) ;

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
```

### Future Improvements
let me know


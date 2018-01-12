/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
   File Name:          15.7.1.js
   ECMA Section:       15.7.1 The Number Constructor Called as a Function
   15.7.1.1
   15.7.1.2

   Description:        When Number is called as a function rather than as a
   constructor, it performs a type conversion.
   15.7.1.1    Return a number value (not a Number object)
   computed by ToNumber( value )
   15.7.1.2    Number() returns 0.

   need to add more test cases.  see the testcases for
   TypeConversion ToNumber.

   Author:             christine@netscape.com
   Date:               29 september 1997
*/

var SECTION = "15.7.1";
var TITLE   = "The Number Constructor Called as a Function";

writeHeaderToLog( SECTION + " "+ TITLE);

new TestCase("Number()",                  0,          Number() );
new TestCase("Number(void 0)",            Number.NaN,  Number(void 0) );
new TestCase("Number(null)",              0,          Number(null) );
new TestCase("Number()",                  0,          Number() );
new TestCase("Number(new Number())",      0,          Number( new Number() ) );
new TestCase("Number(0)",                 0,          Number(0) );
new TestCase("Number(1)",                 1,          Number(1) );
new TestCase("Number(-1)",                -1,         Number(-1) );
new TestCase("Number(NaN)",               Number.NaN, Number( Number.NaN ) );
new TestCase("Number('string')",          Number.NaN, Number( "string") );
new TestCase("Number(new String())",      0,          Number( new String() ) );
new TestCase("Number('')",                0,          Number( "" ) );
new TestCase("Number(Infinity)",          Number.POSITIVE_INFINITY,   Number("Infinity") );

new TestCase("Number(new MyObject(100))",  100,        Number(new MyObject(100)) );

test();

function MyObject( value ) {
  this.value = value;
  this.valueOf = new Function( "return this.value" );
}
/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
   File Name:          string-001.js
   Corresponds To:     15.5.4.2-2-n.js
   ECMA Section:       15.5.4.2 String.prototype.toString()

   Description:        Returns this string value.  Note that, for a String
   object, the toString() method happens to return the same
   thing as the valueOf() method.

   The toString function is not generic; it generates a
   runtime error if its this value is not a String object.
   Therefore it connot be transferred to the other kinds of
   objects for use as a method.

   Author:             christine@netscape.com
   Date:               1 october 1997
*/
var SECTION = "string-001";
var TITLE   = "String.prototype.toString";

writeHeaderToLog( SECTION + " "+ TITLE);

var result = "Failed";
var exception = "No exception thrown";
var expect = "Passed";

try {
  OBJECT = new Object();
  OBJECT.toString = String.prototype.toString();
  result = OBJECT.toString();
} catch ( e ) {
  result = expect;
  exception = e.toString();
}

new TestCase(
  "OBJECT = new Object; "+
  " OBJECT.toString = String.prototype.toString; OBJECT.toString()" +
  " (threw " + exception +")",
  expect,
  result );

test();


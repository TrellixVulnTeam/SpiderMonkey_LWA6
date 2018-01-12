/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
   File Name:          lexical-027.js
   Corresponds To:     7.4.2-4-n.js
   ECMA Section:       7.4.2

   Description:
   The following tokens are ECMAScript keywords and may not be used as
   identifiers in ECMAScript programs.

   Syntax

   var

   Keyword :: one of
   break          for         new         var
   continue       function    return      void
   delete         if          this        while
   else           in          typeof      with

   This test verifies that the keyword cannot be used as an identifier.
   Functioinal tests of the keyword may be found in the section corresponding
   to the function of the keyword.

   Author:             christine@netscape.com
   Date:               12 november 1997

*/
var SECTION = "lexical-027";
var TITLE   = "Keywords";

writeHeaderToLog( SECTION + " "+ TITLE);

var result = "Failed";
var exception = "No exception thrown";
var expect = "Passed";

try {
  eval("var var;");
} catch ( e ) {
  result = expect;
  exception = e.toString();
}

new TestCase(
  "var var" +
  " (threw " + exception +")",
  expect,
  result );

test();



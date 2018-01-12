/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 *  File Name:          switch-002.js
 *  ECMA Section:
 *  Description:        The switch Statement
 *
 *  A simple switch test with no abrupt completions.
 *
 *  Author:             christine@netscape.com
 *  Date:               11 August 1998
 *
 */
var SECTION = "switch-002";
var TITLE   = "The switch statement";

writeHeaderToLog( SECTION + " "+ TITLE);

SwitchTest( 0, 6 );
SwitchTest( 1, 4 );
SwitchTest( 2, 56 );
SwitchTest( 3, 48 );
SwitchTest( 4, 64 );
SwitchTest( true, 32 );
SwitchTest( false, 32 );
SwitchTest( null, 32 );
SwitchTest( void 0, 32 );
SwitchTest( "0", 32 );

test();

function SwitchTest( input, expect ) {
  var result = 0;

  switch ( input ) {
  case 0:
    result += 2;
  case 1:
    result += 4;
    break;
  case 2:
    result += 8;
  case 3:
    result += 16;
  default:
    result += 32;
    break;
  case 4:
    result += 64;
  }

  new TestCase(
    "switch with no breaks:  input is " + input,
    expect,
    result );
}

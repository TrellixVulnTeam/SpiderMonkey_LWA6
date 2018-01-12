// |reftest| skip -- regexp-unicode-property-escapes is not supported
// Copyright 2017 Mathias Bynens. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Mathias Bynens
description: >
  Unicode property escapes for `Noncharacter_Code_Point`
info: |
  Generated by https://github.com/mathiasbynens/unicode-property-escapes-tests
  Unicode v10.0.0
  Emoji v5.0 (UTR51)
esid: sec-static-semantics-unicodematchproperty-p
features: [regexp-unicode-property-escapes]
includes: [regExpUtils.js]
---*/

const matchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x00FDD0, 0x00FDEF],
    [0x00FFFE, 0x00FFFF],
    [0x01FFFE, 0x01FFFF],
    [0x02FFFE, 0x02FFFF],
    [0x03FFFE, 0x03FFFF],
    [0x04FFFE, 0x04FFFF],
    [0x05FFFE, 0x05FFFF],
    [0x06FFFE, 0x06FFFF],
    [0x07FFFE, 0x07FFFF],
    [0x08FFFE, 0x08FFFF],
    [0x09FFFE, 0x09FFFF],
    [0x0AFFFE, 0x0AFFFF],
    [0x0BFFFE, 0x0BFFFF],
    [0x0CFFFE, 0x0CFFFF],
    [0x0DFFFE, 0x0DFFFF],
    [0x0EFFFE, 0x0EFFFF],
    [0x0FFFFE, 0x0FFFFF],
    [0x10FFFE, 0x10FFFF]
  ]
});
testPropertyEscapes(
  /^\p{Noncharacter_Code_Point}+$/u,
  matchSymbols,
  "\\p{Noncharacter_Code_Point}"
);
testPropertyEscapes(
  /^\p{NChar}+$/u,
  matchSymbols,
  "\\p{NChar}"
);

const nonMatchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x00DC00, 0x00DFFF],
    [0x000000, 0x00DBFF],
    [0x00E000, 0x00FDCF],
    [0x00FDF0, 0x00FFFD],
    [0x010000, 0x01FFFD],
    [0x020000, 0x02FFFD],
    [0x030000, 0x03FFFD],
    [0x040000, 0x04FFFD],
    [0x050000, 0x05FFFD],
    [0x060000, 0x06FFFD],
    [0x070000, 0x07FFFD],
    [0x080000, 0x08FFFD],
    [0x090000, 0x09FFFD],
    [0x0A0000, 0x0AFFFD],
    [0x0B0000, 0x0BFFFD],
    [0x0C0000, 0x0CFFFD],
    [0x0D0000, 0x0DFFFD],
    [0x0E0000, 0x0EFFFD],
    [0x0F0000, 0x0FFFFD],
    [0x100000, 0x10FFFD]
  ]
});
testPropertyEscapes(
  /^\P{Noncharacter_Code_Point}+$/u,
  nonMatchSymbols,
  "\\P{Noncharacter_Code_Point}"
);
testPropertyEscapes(
  /^\P{NChar}+$/u,
  nonMatchSymbols,
  "\\P{NChar}"
);

reportCompare(0, 0);

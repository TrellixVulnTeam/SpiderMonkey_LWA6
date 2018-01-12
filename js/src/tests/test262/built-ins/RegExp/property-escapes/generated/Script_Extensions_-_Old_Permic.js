// |reftest| skip -- regexp-unicode-property-escapes is not supported
// Copyright 2017 Mathias Bynens. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Mathias Bynens
description: >
  Unicode property escapes for `Script_Extensions=Old_Permic`
info: |
  Generated by https://github.com/mathiasbynens/unicode-property-escapes-tests
  Unicode v10.0.0
  Emoji v5.0 (UTR51)
esid: sec-static-semantics-unicodematchproperty-p
features: [regexp-unicode-property-escapes]
includes: [regExpUtils.js]
---*/

const matchSymbols = buildString({
  loneCodePoints: [
    0x000483
  ],
  ranges: [
    [0x010350, 0x01037A]
  ]
});
testPropertyEscapes(
  /^\p{Script_Extensions=Old_Permic}+$/u,
  matchSymbols,
  "\\p{Script_Extensions=Old_Permic}"
);
testPropertyEscapes(
  /^\p{Script_Extensions=Perm}+$/u,
  matchSymbols,
  "\\p{Script_Extensions=Perm}"
);
testPropertyEscapes(
  /^\p{scx=Old_Permic}+$/u,
  matchSymbols,
  "\\p{scx=Old_Permic}"
);
testPropertyEscapes(
  /^\p{scx=Perm}+$/u,
  matchSymbols,
  "\\p{scx=Perm}"
);

const nonMatchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x00DC00, 0x00DFFF],
    [0x000000, 0x000482],
    [0x000484, 0x00DBFF],
    [0x00E000, 0x01034F],
    [0x01037B, 0x10FFFF]
  ]
});
testPropertyEscapes(
  /^\P{Script_Extensions=Old_Permic}+$/u,
  nonMatchSymbols,
  "\\P{Script_Extensions=Old_Permic}"
);
testPropertyEscapes(
  /^\P{Script_Extensions=Perm}+$/u,
  nonMatchSymbols,
  "\\P{Script_Extensions=Perm}"
);
testPropertyEscapes(
  /^\P{scx=Old_Permic}+$/u,
  nonMatchSymbols,
  "\\P{scx=Old_Permic}"
);
testPropertyEscapes(
  /^\P{scx=Perm}+$/u,
  nonMatchSymbols,
  "\\P{scx=Perm}"
);

reportCompare(0, 0);

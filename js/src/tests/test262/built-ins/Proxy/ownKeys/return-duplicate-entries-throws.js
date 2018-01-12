// Copyright (C) 2017 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-proxy-object-internal-methods-and-internal-slots-ownpropertykeys
description: >
    The returned list must not contain any duplicate entries.
info: >
    [[OwnPropertyKeys]] ( )

    ...
    9. If trapResult contains any duplicate entries, throw a TypeError exception.
---*/

var p = new Proxy({}, {
  ownKeys() {
    return ["a", "a"];
  }
});

assert.throws(TypeError, function() {
  Object.keys(p);
});

reportCompare(0, 0);

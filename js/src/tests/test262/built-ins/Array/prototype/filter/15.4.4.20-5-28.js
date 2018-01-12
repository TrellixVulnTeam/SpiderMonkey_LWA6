// Copyright (c) 2012 Ecma International.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-array.prototype.filter
es5id: 15.4.4.20-5-28
description: Array.prototype.filter - the returned array is instanceof Array
---*/

        var newArr = [11].filter(function () { });

assert(newArr instanceof Array, 'newArr instanceof Array !== true');

reportCompare(0, 0);

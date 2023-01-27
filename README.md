# Not So Weak

[![build status](https://github.com/WebReflection/not-so-weak/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/not-so-weak/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/not-so-weak/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/not-so-weak?branch=main)

<sup>**Social Media Photo by [Pete Nuij](https://unsplash.com/@pete_nuij) on [Unsplash](https://unsplash.com/)**</sup>

Iterable [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) (*WKey*) and [WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) (*WSet*) through [FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry) and [WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) primitives, reimplementing also the [WeakValue](https://github.com/WebReflection/weak-value#readme) (*WValue*) module without the *callback* and/or non standard API signatures.

```js
// const {WSet, WKey, WValue} = require('not-so-weak');
import {WSet, WKey, WValue} from 'not-so-weak';

// class WSet<T extends object> extends WeakSet implements Set {}
// class WKey<K extends object, V> extends WeakMap implements Map {}
// class WValue<K, V extends object> extends Map {}

// node --expose-gc example
const ws = new WSet([{}]);
const wm = new WKey([[{}, 'value']]);
const wv = new WValue([['value', {}]]);

console.assert(ws.size === 1);
console.assert(wm.size === 1);
console.assert([...wm.values()][0] === 'value');
console.assert([...wv.keys()][0] === 'value');

setTimeout(() => {
  gc();
  console.assert(ws.size === 0);
  console.assert(wm.size === 0);
  console.assert(wv.size === 0);
});
```

### Suitable For

  * Weak key/value based state/store
  * Server Side related tasks that can't bother with manual removal of weakly referenced entries
  * every case where you end up swapping to `Map` or `Set` because you realize you cannot iterate over their *Weak* counterpart
  * every case where you think there's a memory leak due possibly missing `weakThing.delete(ref)` operations

### Not Suitable For

  * raw performance or benchmarks against `Map` or `Set`
  * every case where `weakThing.delete(ref)` is already handled by the library or framework logic

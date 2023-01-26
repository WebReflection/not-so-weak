import {NSWeakSet, NSWeakMap} from '../esm/index.js';

const assert = (got, expected, message = {got, expected}) => {
  if (!Object.is(got, expected)) {
    console.error(message);
    process.exit(1);
  }
};

assert(NSWeakSet[Symbol.species], NSWeakSet);
assert(NSWeakMap[Symbol.species], NSWeakMap);

const ws = new NSWeakSet([{}]);
const wm = new NSWeakMap([[{}, 'value']]);

assert(ws.size, 1, 'ok constructor');
assert(wm.size, 1, 'ok constructor');

setTimeout(() => {
  gc();
  assert(ws.size, 0, 'ok ws collector');
  assert(wm.size, 0, 'ok wm collector');
});

const wsAPI = new NSWeakSet;
wsAPI.add(ws);
assert(wsAPI.size, 1, 'ok ws add');
wsAPI.add(ws);
assert(wsAPI.size, 1, 'ok ws repeated add');
assert(wsAPI.has(ws), true, 'ok ws has');
assert([...wsAPI.keys()][0], [...wsAPI.values()][0], 'ok ws keys/values');
assert([...wsAPI.keys()][0], ws, 'ok ws keys/values check');
assert([...wsAPI.entries()][0][0], [...wsAPI.entries()][0][1], 'ok ws entries');
assert([...wsAPI.entries()][0][0], ws, 'ok ws entries check');
let each = 0;
wsAPI.forEach(function (a, b, set) {
  each++;
  assert(this, ws);
  assert(a, ws);
  assert(b, ws);
  assert(set, wsAPI);
}, ws);
assert(each, 1, 'ok ws forEach');
assert(wsAPI.delete(ws), true, 'ok ws delete');
assert(wsAPI.delete(ws), false, 'ok ws repeated delete');
assert(wsAPI.has(ws), false, 'ok ws repeated has');
wsAPI.add(ws);
assert(wsAPI.size, 1);
wsAPI.clear();
assert(wsAPI.size, 0);

const wmAPI = new NSWeakMap;
wmAPI.set(wm, 'value');
assert(wmAPI.size, 1, 'ok wm set');
wmAPI.set(wm, 'new value');
assert(wmAPI.size, 1, 'ok wm repeated add');
assert(wmAPI.has(wm), true, 'ok wm has');
assert(wmAPI.get(wm), 'new value', 'ok wm get');
assert([...wmAPI.keys()][0], wm, 'ok wm keys check');
assert([...wmAPI.values()][0], 'new value', 'ok wm values check');
assert([...wmAPI.entries()][0][0], wm, 'ok wm entries keys check');
assert([...wmAPI.entries()][0][1], 'new value', 'ok wm entries values check');
let wmeach = 0;
wmAPI.forEach(function (value, key, map) {
  wmeach++;
  assert(this, wm);
  assert(value, 'new value');
  assert(key, wm);
  assert(map, wmAPI);
}, wm);
assert(wmeach, 1, 'ok wm forEach');
assert(wmAPI.delete(wm), true, 'ok wm delete');
assert(wmAPI.delete(wm), false, 'ok wm repeated delete');
assert(wmAPI.has(wm), false, 'ok wm repeated has');
wmAPI.set(wm, 1);
assert(wmAPI.size, 1);
wmAPI.clear();
assert(wmAPI.size, 0);

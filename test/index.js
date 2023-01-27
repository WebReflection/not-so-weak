import {WSet, WKey, WValue} from '../esm/index.js';

const assert = (got, expected, message = {got, expected}) => {
  if (!Object.is(got, expected)) {
    console.error(message);
    process.exit(1);
  }
};

// Removed as MDN warning suggests
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
// assert(WSet[Symbol.species], WSet);
// assert(WKey[Symbol.species], WKey);
// assert(WValue[Symbol.species], WValue);

const ws = new WSet([{}]);
const wm = new WKey([[{}, 'value']]);
const wv = new WValue([['value', {}]]);

assert(ws.size, 1, 'ok ws constructor');
assert(wm.size, 1, 'ok wm constructor');
assert(wv.size, 1, 'ok wv constructor');

gc();
setTimeout(() => {
  gc();
  setTimeout(() => {
    gc();
    assert(ws.size, 0, 'ok ws collector');
    assert(wm.size, 0, 'ok wm collector');
    assert(wv.size, 0, 'ok wv collector');

    ws.add({});
    wm.set({}, 'value');
    wv.set('value', {});
    setTimeout(() => {
      gc();
      assert(ws.size, 0, 'ok ws collector');
      assert(wm.size, 0, 'ok wm collector');
      assert(wv.size, 0, 'ok wv collector');
    });
  }, 100);
}, 100);

const wsAPI = new WSet;
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

const wmAPI = new WKey;
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


const wvAPI = new WValue;
wvAPI.set('value', wm);
assert(wvAPI.size, 1, 'ok wv set');
wvAPI.set('value', wv);
assert(wvAPI.size, 1, 'ok wv repeated add');
assert(wvAPI.has('value'), true, 'ok wv has');
assert(wvAPI.get('value'), wv, 'ok wv get');
assert([...wvAPI.keys()][0], 'value', 'ok wv keys check');
assert([...wvAPI.values()][0], wv, 'ok wv values check');
assert([...wvAPI.entries()][0][0], 'value', 'ok wv entries keys check');
assert([...wvAPI.entries()][0][1], wv, 'ok wv entries values check');
let wveach = 0;
wvAPI.forEach(function (value, key, map) {
  wveach++;
  assert(this, wv);
  assert(value, wv);
  assert(key, 'value');
  assert(map, wvAPI);
}, wv);
assert(wveach, 1, 'ok wv forEach');
assert(wvAPI.delete('value'), true, 'ok wv delete');
assert(wvAPI.delete('value'), false, 'ok wv repeated delete');
assert(wvAPI.has('value'), false, 'ok wv repeated has');
wvAPI.set(1, wv);
assert(wvAPI.size, 1);
wvAPI.clear();
assert(wvAPI.size, 0);

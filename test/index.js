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

let wkFinalization = false;
const wk = new WKey;
wk.set({}, 'value', function (value) {
  assert(value, 'value', 'wk finalization callback');
  assert(this, wk, 'wk finalization context');
  wkFinalization = true;
});

let wvFinalization = false;
const wv = new WValue;
wv.set('value', {}, function (key) {
  assert(key, 'value', 'wv finalization callback');
  assert(this, wv, 'wv finalization context');
  wvFinalization = true;
});

const wvNoCallback = new WValue([['value', {}]]);

assert(ws.size, 1, 'ok ws size');
assert(wk.size, 1, 'ok wk size');
assert(wv.size, 1, 'ok wv size');
assert(wvNoCallback.size, 1, 'ok wvNoCallback size');

gc();
setTimeout(() => {
  gc();
  setTimeout(() => {
    gc();
    assert(ws.size, 0, 'ok ws collector');
    assert(wk.size, 0, 'ok wk collector');
    assert(wv.size, 0, 'ok wv collector');
    assert(wvNoCallback.size, 0, 'ok wv collector');
    assert(wkFinalization, true, 'ok wk finalization');
    assert(wvFinalization, true, 'ok wv finalization');

    ws.add({});
    wk.set({}, 'value');
    wv.set('value', {});
    setTimeout(() => {
      gc();
      assert(ws.size, 0, 'ok ws collector');
      assert(wk.size, 0, 'ok wk collector');
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

const wkAPI = new WKey([[wk, 'value']]);
assert(wkAPI.size, 1, 'ok wk constructor');
wkAPI.set(wk, 'new value');
assert(wkAPI.size, 1, 'ok wk repeated add');
assert(wkAPI.has(wk), true, 'ok wk has');
assert(wkAPI.get(wk), 'new value', 'ok wk get');
assert([...wkAPI.keys()][0], wk, 'ok wk keys check');
assert([...wkAPI.values()][0], 'new value', 'ok wk values check');
assert([...wkAPI.entries()][0][0], wk, 'ok wk entries keys check');
assert([...wkAPI.entries()][0][1], 'new value', 'ok wk entries values check');
let wkeach = 0;
wkAPI.forEach(function (value, key, map) {
  wkeach++;
  assert(this, wk);
  assert(value, 'new value');
  assert(key, wk);
  assert(map, wkAPI);
}, wk);
assert(wkeach, 1, 'ok wk forEach');
assert(wkAPI.delete(wk), true, 'ok wk delete');
assert(wkAPI.delete(wk), false, 'ok wk repeated delete');
assert(wkAPI.has(wk), false, 'ok wk repeated has');
wkAPI.set(wk, 1);
assert(wkAPI.size, 1);
wkAPI.clear();
assert(wkAPI.size, 0);


const wvAPI = new WValue([['value', wk]]);
assert(wvAPI.size, 1, 'ok wv constructor');
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

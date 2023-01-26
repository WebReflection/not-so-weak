'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {iterator, species} = Symbol;

const refs = new WeakMap;

const set = value => {
  const ref = new WeakRef(value);
  refs.set(value, ref);
  return ref;
};

const get = value => refs.get(value) || set(value);

class NSWeakSet extends Set {
  static get [species]() { return NSWeakSet };
  // <same>
  #registry = new FinalizationRegistry(ref => super.delete(ref));
  #drop(ref) {
    const had = super.delete(ref);
    if (had)
      this.#registry.unregister(ref);
    return had;
  }
  get size() { return [...this].length }
  delete(value) {
    return this.#drop(refs.get(value));
  }
  has(value) {
    return super.has(refs.get(value));
  }
  // </same>
  constructor(entries = []) {
    super();
    for (const value of entries)
      this.add(value);
  }
  clear() {
    for (const ref of super[iterator]())
      this.#registry.unregister(ref);
    super.clear();
  }
  add(value) {
    const ref = get(value);
    if (!super.has(ref)) {
      this.#registry.register(value, ref, ref);
      super.add(ref);
    }
    return this;
  }
  forEach(callback, thisArg) {
    for (const value of [...this])
      callback.call(thisArg, value, value, this);
  }
  *[iterator]() {
    for (const ref of super[iterator]()) {
      const value = ref.deref();
      if (value)
        yield value;
      else
        this.#drop(ref);
    }
  }
  *entries() {
    for (const value of this)
      yield [value, value];
  }
  *keys() { yield *this[iterator]() }
  *values() { yield *this[iterator]() }
}
exports.NSWeakSet = NSWeakSet

class NSWeakMap extends Map {
  static get [species]() { return NSWeakMap };
  // <same>
  #registry = new FinalizationRegistry(ref => super.delete(ref));
  #drop(ref) {
    const had = super.delete(ref);
    if (had)
      this.#registry.unregister(ref);
    return had;
  }
  get size() { return [...this].length }
  delete(key) {
    return this.#drop(refs.get(key));
  }
  has(key) {
    return super.has(refs.get(key));
  }
  // </same>
  constructor(entries = []) {
    super();
    for (const [key, value] of entries)
      this.set(key, value);
  }
  clear() {
    for (const ref of super.keys())
      this.#registry.unregister(ref);
    super.clear();
  }
  forEach(callback, thisArg) {
    for (const [key, value] of [...this])
      callback.call(thisArg, value, key, this);
  }
  get(key) {
    return super.get(refs.get(key));
  }
  set(key, value) {
    const ref = get(key);
    if (!super.has(ref))
      this.#registry.register(key, ref, ref);
    return super.set(ref, value);
  }
  *[iterator]() {
    for (const [ref, value] of super[iterator]()) {
      const key = ref.deref();
      if (key)
        yield [key, value];
      else
        this.#drop(ref);
    }
  }
  *entries() {
    yield *this[iterator]();
  }
  *keys() {
    for (const [key] of this)
      yield key;
  }
  *values() {
    for (const [_, value] of this)
      yield value;
  }
}
exports.NSWeakMap = NSWeakMap

class NSWeakValue extends Map {
  static get [species]() { return NSWeakValue };
  #registry = new FinalizationRegistry(key => super.delete(key));
  get size() { return [...this].length }
  #drop(key, ref) {
    const had = super.delete(key);
    if (had)
      this.#registry.unregister(ref);
    return had;
  }
  constructor(entries = []) {
    super();
    for (const [key, value] of entries)
      this.set(key, value);
  }
  clear() {
    for (const ref of super.values())
      this.#registry.unregister(ref);
    super.clear();
  }
  delete(key) {
    return this.#drop(key, super.get(key));
  }
  forEach(callback, thisArg) {
    for (const [key, value] of [...this])
      callback.call(thisArg, value, key, this);
  }
  get(key) {
    return super.get(key)?.deref();
  }
  set(key, value) {
    let ref = super.get(key);
    if (ref)
      this.#registry.unregister(ref);
    ref = get(value);
    this.#registry.register(value, key, ref);
    return super.set(key, ref);
  }
  *[iterator]() {
    for (const [key, ref] of super[iterator]()) {
      const value = ref.deref();
      if (value)
        yield [key, value];
      else
        this.#drop(key, ref);
    }
  }
  *entries() {
    yield *this[iterator]();
  }
  *keys() {
    for (const [key] of this)
      yield key;
  }
  *values() {
    for (const [_, value] of this)
      yield value;
  }
}
exports.NSWeakValue = NSWeakValue

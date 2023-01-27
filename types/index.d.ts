/**
 * An iterable WeakSet.
 */
export class WSet<T extends object> extends WeakSet {
  clear(): void;
  /**
   * Executes a provided function once per each value in the WeakSet object, in insertion order.
   */
  forEach(callbackfn: (value: T, value2: T, set: WSet<T>) => void, thisArg?: any): void;
  /**
   * @returns the number of (unique) elements in the WeakSet.
   */
  readonly size: number;
  /** Iterates over values in the WeakSet. */
  [Symbol.iterator](): IterableIterator<T>;
  /**
   * Returns an iterable of [v,v] pairs for every value `v` in the WeakSet.
   */
  entries(): IterableIterator<[T, T]>;
  /**
   * Despite its name, returns an iterable of the values in the WeakSet.
   */
  keys(): IterableIterator<T>;

  /**
   * Returns an iterable of values in the WeakSet.
   */
  values(): IterableIterator<T>;
}

/**
 * An iterable WeakMap.
 */
export class WKey<K extends object, V> extends WeakMap {
  clear(): void;
  /**
   * Executes a provided function once per each key/value pair in the WeakMap, in insertion order.
   */
  forEach(callbackfn: (value: V, key: K, map: WKey) => void, thisArg?: any): void;
  /**
   * @returns the number of elements in the WeakMap.
   */
  readonly size: number;
  /** Returns an iterable of entries in the map. */
  [Symbol.iterator](): IterableIterator<[K, V]>;
  /**
   * Returns an iterable of key, value pairs for every entry in the map.
   */
  entries(): IterableIterator<[K, V]>;

  /**
   * Returns an iterable of keys in the map
   */
  keys(): IterableIterator<K>;

  /**
   * Returns an iterable of values in the map
   */
  values(): IterableIterator<V>;
}


/**
 * A Map with weak values insted of keys.
 */
export class WValue<K, V extends object> extends Map {}

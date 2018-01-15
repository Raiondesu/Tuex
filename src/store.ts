import { desc, keysOf, isFunction, isGetter, isObject, isSetter, isValue, error } from './misc'

export type EventType = 'value' | 'getter' | 'setter' | 'action' | 'global';

let _vue;

export function install(Vue) {
  if (_vue && Vue === _vue) {
    error('[tuex] is already installed. Vue.use(Tuex) should be called only once.')
    return;
  }
  _vue = Vue;
}

let _eventPool: { [key: string]: ((store, key: string, ...args) => any)[] } = {
  value: [],
  getter: [],
  setter: [],
  action: [],
  global: []
}

function _storeEvent(type: EventType, store, key: string, ...args) {
  for (var i = 0; i < _eventPool[type].length; i++)
    _eventPool[type][i](store, key, ...args);
}

let _strict: boolean = false;

let _store;

export interface PluginContext<T> {
  store: T;
  replaceStore(target: T | (new () => T)): void;
  subscribe(type: EventType, callback: (store: T, key: string, ...args) => any): void;
}

export const Store = (function () {
  class Store<T> {
    constructor(
      target: T | (new () => T),
      options?: {
        strict?: boolean,
        plugins?: ((arg: PluginContext<T>) => any)[],
      }
    ) {
      // Auto install if it is not done yet and `window` has `Vue`
      if (!_vue && typeof window !== 'undefined' && window['Vue']) {
        install(window['Vue']);
      }

      const { strict, plugins } = options || { strict: false, plugins: [] };
      _strict = strict;

      Object.defineProperties(this, objectToStore(target));
      Object.seal(this);
      _store = this;

      if (_vue && !_vue.prototype.$store)
        Object.defineProperty(_vue.prototype, '$store', {
          get: () => _store
        });
      else if (_vue)
        replaceStore(target);

      plugins && plugins.forEach(plugin => plugin.apply({
        store: _store,
        replaceStore,
        subscribe,
      }));
    }
  }
  return Store as new <T>(
    target: T | (new () => T),
    options?: {
      strict?: boolean,
      plugins?: ((arg: PluginContext<T>) => any)[],
    }
  ) => Store<T> & T;
}());

/**
 * Subscribe for store events.
 * Callback is executed BEFORE the event!
 *
 * @param {'value' | 'getter' | 'setter' | 'action' | 'global'} type
 * @param {(store: T, key: string) => any} callback
 * @returns a funciton to unsubscribe from event
 * @memberof Tuex
 */
function subscribe<T>(type: EventType, callback: (store: T, key: string, ...args) => any) {
  _eventPool[type].push(callback);
  return () => {
    _eventPool[type] = [..._eventPool[type].filter(c => c != callback)];
  }
}

/** replaceStore
 *
 * A function that replaces the current store with the other one,
 * converting it from a target object/constructor
 *
 * @param {(T | (new () => T))} target
 * @memberof Tuex
 */
function replaceStore<T>(target: (T | (new () => T))) {
  _store = {};
  Object.defineProperties(_store, objectToStore(target));
}

/** objectToStore
 *
 * Converts a plain js object into a valid Tuex-store
 *
 * @param {(T | (new () => T))} plain - object/constructor to convert
 * @returns { [key: string]: PropertyDescriptor } - converted store descriptors
 * @memberof Tuex
 */
function objectToStore<T>(target: (T | (new () => T))): { [key: string]: PropertyDescriptor } {
  let plain, proto;

  if (isFunction(target)) {
    plain = new (target as new () => T)();
    proto = (target as new () => T).prototype;
  } else {
    plain = target;
  }

  const obj = {};
  const keys = keysOf(plain);

  if (proto)
    keys.push(...keysOf(proto));

  for (let key of keys) {
    if (obj[key] !== undefined || key === 'constructor') {
      (key !== 'constructor') && error(`Can't redefine '${key}'! Key is already defined!`);
      continue;
    }

    const define = (prop: PropertyDescriptor) => obj[key] = prop;
    const descriptor = desc(plain, key) || desc(proto, key);

    const callStoreEvent = (type: EventType, ...args) => _storeEvent(type, plain, key, ...args);

    if (isFunction(plain[key])) define({
      value() {
        var args = new Array(arguments.length),
            _args = new Array(arguments.length + 1);

        _args[0] = 'action';

        for (var i = 0; i < arguments.length; i++)
          _args[i + 1] = args[i] = arguments[i];

        callStoreEvent.apply(void 0, _args);
        return (<any>plain)[key].apply(_store, args);
      }
    });
    else if (isValue(descriptor)) {
      let get, set;

      if (descriptor.get)
        get = () => {
          callStoreEvent('value');
          return descriptor.get.call(_store);
        }
      else
        get = () => {
          callStoreEvent('value');
          return plain[key];
        }

      if (descriptor.set && !_strict)
        set = value => {
          callStoreEvent('global', value);
          callStoreEvent('value', value);
          descriptor.set.call(_store, value);
        }
      else if (!_strict) {
        if (isObject(descriptor)) {
          plain[key] = objectToStore(plain[key]);
          Object.defineProperty(plain[key], '$root', {
            get: () => _store
          });

          set = value => {
            callStoreEvent('global', value);
            callStoreEvent('value', value);
            plain[key] = objectToStore(value);
            Object.defineProperty(plain[key], '$root', {
              get: () => _store
            });
          }
        } else set = value => {
          callStoreEvent('global', value);
          callStoreEvent('value', value);
          plain[key] = value;
        }
      } else {
        set = () => error(
          'Explicit mutations of `' + key + '` are prohibited!\nPlease, use setters instead or disable the [strict] flag!'
        );
      }

      define({ enumerable: true, get, set });
    }
    else if (isGetter(descriptor)) define({
      get: () => {
        callStoreEvent('getter');
        return descriptor.get.call(_store);
      }
    });
    else if (isSetter(descriptor)) define({
      set: value => {
        callStoreEvent('global', value);
        callStoreEvent('setter', value);
        descriptor.set.call(_store, value);
      }
    });
    else error('Descriptor of `' + key + '` has niether getter, setter nor value!');
  }

  return obj;
}

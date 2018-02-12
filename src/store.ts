import Vue from "vue";
import { prototype } from "events";
import { clearEvents, subscribe, executeStoreEvent } from "./events";
import { error, desc, isFunction, keysOf, isValue, isObject, isGetter, isSetter, fromPath } from "./misc";
import { EventType, MutationPayload, ActionPayload, Commit, Dispatch } from '../types';

export let _vue;
export let _state = {};
export let _strict: boolean = false;

export let isInstalled: boolean = false;
export let vm: Vue;

export const stateWrapper = {
  get state() {
    return _state;
  },

  set state(value) {
    _strict && error('Do not assign values to state direcly.\nUse [replaceState] explicitly!')
    replaceState(value);
  }
}

/** replaceState
 *
 * A function that replaces the current store with the other one,
 * converting it from a target object/constructor
 *
 * @param {(T | (new () => T))} target
 * @memberof Tuex
 */
export function replaceState<T>(target: (T | (new () => T))) {
  _state = objectToStore(target);
  Object.preventExtensions(_state);
}

export function install(Vue) {
  if (_vue && Vue === _vue && !!Vue) {
    error('[tuex] is already installed. Vue.use(Tuex) should be called only once.')
    return;
  }
  _vue = Vue;
  isInstalled = !!_vue;
}

export class Store<T> {
  constructor(
    target: T | (new () => T),
    options?: {
      strict?: boolean;
      plugins?: ((store: Store<T>) => void)[];
    }
  ) {
    // Auto install if it is not done yet and `window` has `Vue`
    if (!_vue && typeof window !== 'undefined' && window['Vue']) {
      install(window['Vue']);
    }

    clearEvents();

    const { strict, plugins } = options || { strict: false, plugins: [] };
    _strict = strict;

    Object.defineProperty(this, 'state', desc(stateWrapper, 'state'));
    this.state = target as T;

    if (!_vue.prototype.$store) {
      Object.defineProperty(_vue.prototype.$store, 'state', desc(stateWrapper, 'state'));
    }

    plugins && plugins.forEach(plugin => plugin(this));
  }

  public readonly state: T;
  public readonly replaceState = replaceState;
  public readonly subscribe = subscribe;
  public readonly clearEvents = clearEvents;

  /**
   * commit
   */
  public commit: Commit<T> = function () {
    if (typeof arguments[0] === 'string') {
      var type: string = arguments[0];
      var payload = arguments[1];
    } else {
      const p: MutationPayload<T> = arguments[0];
      type = p.type;
      payload = p.payload;
    }

    if (/.*(\.|\/).*/.test(type)) {
      type = type.replace(/\//g, '.');

      var idx = type.lastIndexOf('.');
      var value = fromPath(this.state, type.substring(0, idx));
      value[type.substr(idx)] = payload;
    } else {
      this.state[type] = payload;
    }
  }
  /**
   * dispatch
   */
  public dispatch: Dispatch<T> = function () {
    if (typeof arguments[0] === 'string') {
      var type: keyof T = arguments[0];
      var payload = arguments[1];
    } else {
      var { type, payload }: ActionPayload<T> = arguments[0];
    }
    return fromPath(this.state, type)(payload);
  }
};



/** objectToStore
 * Converts a plain js object into a valid Tuex store
 *
 * @param {(T | (new () => T))} plain object/constructor to convert
 * @returns converted store
 * @memberof Tuex
 */
/* export function objectToStore<T>(target: (T | (new () => T) | (() => T)), path: string = ''): PropertyDescriptorMap {
  let plain, proto;

  if (isFunction({ value: target })) {
    try {
      plain = new (target as new () => T)();
      proto = (target as new () => T).prototype;
    } catch (e) {
      error(e);
      plain = (target as () => T)()
    }
  } else {
    plain = target;
  }

  const store = fromPath(_state, path);
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

    const callStoreEvent = (type: EventType, ...args) => executeStoreEvent(type, fromPath(_state, path), key, ...args);

    if (isFunction(descriptor)) define({
      value() {
        var args = new Array(arguments.length),
            _args = new Array(arguments.length + 1);

        _args[0] = 'action';

        for (var i = 0; i < arguments.length; i++)
          _args[i + 1] = args[i] = arguments[i];

        callStoreEvent.apply(void 0, _args);
        return (<any>plain)[key].apply(store, args);
      }
    });
    else if (isValue(descriptor)) {
      let get, set;

      if (descriptor.get) get = () => {
        callStoreEvent('getter');
        return descriptor.get.call(store);
      }
      else get = isObject(descriptor) ? () => {
        callStoreEvent('object');
        return plain[key];
      } : () => {
        callStoreEvent('value');
        return plain[key];
      }

      if (descriptor.set && !_strict)
        set = value => {
          callStoreEvent('global', value);
          callStoreEvent('value', value);
          descriptor.set.call(store, value);
        }
      else if (!_strict) {
        if (isObject(descriptor)) {
          const defineValue = value => {
            const temp = objectToStore(value, path ? path + '.' + key : key);
            plain[key] = {};
            Object.defineProperties(plain[key], temp);
            !plain[key].$root && Object.defineProperty(plain[key], '$root', desc(stateWrapper, 'store'));
            Object.preventExtensions(plain[key]);
          };

          defineValue(plain[key]);

          set = value => {
            callStoreEvent('object', value);
            callStoreEvent('value', value);
            defineValue(value);
          }
        } else set = value => {
          callStoreEvent('global', value);
          callStoreEvent('value', value);
          plain[key] = value;
        }
      } else set = () => {
        error(
          'Explicit mutations of `' + key + '` are prohibited!\nPlease, use setters instead or disable the [strict] flag!'
        );
      }

      define({ enumerable: true, get, set });
    }
    else if (isGetter(descriptor)) define({
      get: () => {
        callStoreEvent('getter');
        return descriptor.get.call(store);
      }
    });
    else if (isSetter(descriptor)) define({
      set: value => {
        callStoreEvent('global', value);
        callStoreEvent('setter', value);
        descriptor.set.call(store, value);
      }
    });
    else error('Descriptor of `' + key + '` has niether getter, setter nor value!');
  }

  return obj;
} */

export function objectToStore<T>(target: (T | (new () => T)), path: string = ''): T {
  const { keys, plain, proto } = constructorToObject(target);

  const store = fromPath(_state, path);
  const obj: T = {} as T;

  for (let key of keys) {
    if (obj[key] !== undefined) {
      error(`Can't redefine '${key}'! Key is already defined!`);
      continue;
    }
    const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
    const descriptor = desc(fromPath(plain, path), key) || desc(fromPath(proto, path), key);

    const callStoreEvent = (type: EventType, ...args) => executeStoreEvent(type, fromPath(_state, path), key, ...args);

    if (isFunction(descriptor)) define({
      value() {
        var args = new Array(arguments.length),
            _args = new Array(arguments.length + 1);

        _args[0] = 'action';

        for (var i = 0; i < arguments.length; i++)
          _args[i + 1] = args[i] = arguments[i];

        callStoreEvent.apply(void 0, _args);
        return (<any>plain)[key].apply(store, args);
      }
    });
    else if (isGetter(descriptor)) define({
      get: () => {
        callStoreEvent('getter');
        return descriptor.get.call(store);
      }
    });
    else if (isSetter(descriptor)) define({
      set: value => {
        callStoreEvent('mutation', value);
        callStoreEvent('setter', value);
        descriptor.set.call(store, value);
      }
    });
    else if (isValue(descriptor)) {
      let get, set;

      if (descriptor.get) get = () => {
        callStoreEvent('getter');
        return descriptor.get.call(store);
      }
      else get = isObject(descriptor) ? () => {
        callStoreEvent('object');
        return plain[key];
      } : () => {
        callStoreEvent('value');
        return plain[key];
      }

      if (descriptor.set && !_strict)
        set = value => {
          callStoreEvent('mutation', value);
          callStoreEvent('value', value);
          descriptor.set.call(store, value);
        }
      else if (!_strict) {
        if (isObject(descriptor)) {
          const defineValue = value => {
            const temp = objectToStore(value, path ? path + '.' + key : key);
            (<any>plain[key]) = {};
            Object.defineProperties(plain[key], temp);
            !(<any>plain[key]).$root && Object.defineProperty(plain[key], '$root', desc(stateWrapper, 'state'));
            Object.preventExtensions(plain[key]);
          };

          defineValue(plain[key]);

          set = value => {
            callStoreEvent('object', value);
            callStoreEvent('value', value);
            defineValue(value);
          }
        } else set = value => {
          callStoreEvent('mutation', value);
          callStoreEvent('value', value);
          plain[key] = value;
        }
      } else set = () => {
        error(
          'Explicit mutations of `' + key + '` are prohibited!\nPlease, use setters instead or disable the [strict] flag!'
        );
      }

      define({ enumerable: true, get, set });
    }
    else error('Descriptor of `' + key + '` has niether getter, setter nor value!');
  }

  return obj;
}

export function constructorToObject<T>(target: (T | (new () => T))): { plain: T, keys: (keyof T)[], proto } {
  let plain: T, proto;

  if (isFunction({ value: target })) {
    plain = new (target as new () => T)();
    proto = (target as new () => T).prototype;
  } else {
    plain = target as T;
  }

  const keys = keysOf(plain);

  if (proto) {
    /// Filtering out some prototype trash
    const trash = key => !~[
      'constructor'
    ].indexOf(key);

    keys.push(...keysOf<T>(proto).filter(trash));
  }

  return { plain, keys, proto };
}

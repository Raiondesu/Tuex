import Vue, { VueConstructor } from "vue";
import { prototype } from "events";
import { clearEvents, subscribe, executeStoreEvent } from "./events";
import { error, desc, isFunction, keysOf, isValue, isObject, isGetter, isSetter, pathValue } from "./misc";
import { EventType, MutationPayload, ActionPayload, Commit, Dispatch } from '../types';

export let _vue: VueConstructor;
export let _state: any = {};
export let _plain: any = {};
export let _strict: boolean = false;

export let isInstalled: boolean = false;
export let vms: Vue[] = [];

export const stateWrapper = {
  get state() {
    return _state;
  },

  set state(value) {
    _strict && error('Do not assign values to state direcly.\nUse [replaceState] explicitly!')
    replaceState(value);
  }
}

export function install(Vue: VueConstructor) {
  if (_vue && Vue === _vue && !!Vue) {
    error('[tuex] is already installed. Vue.use(Tuex) should be called only once.')
    return;
  }
  _vue = Vue;
  isInstalled = !!_vue;
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
  _state = {};
  objectToStore(target);
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
      _vue.prototype.$store = this;
    }

    plugins && plugins.forEach(plugin => plugin(this));
  }

  public readonly state: T;
  public readonly replaceState = replaceState;
  public readonly subscribe = subscribe;
  public readonly clearEvents = clearEvents;

  public readonly getters;

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
      var value = pathValue(this.state, type.substring(0, idx));
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
    return pathValue(this.state, type)(payload);
  }
};



/** objectToStore
 * Converts a plain js object into a valid Tuex store
 *
 * @param {(T | (new () => T))} plain object/constructor to convert
 * @returns converted store
 * @memberof Tuex
 */
export function objectToStore<T>(target: (T | (new () => T)), path: string = '', level: number = 0) {
  const { keys, plain, proto } = constructorToObject(target);
  const store = path ? pathValue(_state, path) : _state;
}

export function wrapFunction(func, store, callStoreEvent) {
  return function () {
    var args = new Array(arguments.length),
    _args = new Array(arguments.length + 1);

    _args[0] = 'action';

    for (var i = 0; i < arguments.length; i++)
      _args[i + 1] = args[i] = arguments[i];

    callStoreEvent.apply(void 0, _args);
    return func.apply(store, args);
  };
}


export function constructorToObject<T>(target: (T | (new () => T))): { plain: T, keys: (keyof T)[], proto } {
  let plain: T, proto;

  if (isFunction({ value: target })) {
    plain = new (target as new () => T)();
    proto = (target as new () => T).prototype;
  } else {
    plain = target as T;
  }

  const keys = plain ? keysOf(plain) : [];

  if (proto) {
    /// Filtering out some prototype trash
    const trash = key => !~[
      'constructor'
    ].indexOf(key);

    keys.push(...keysOf<T>(proto).filter(trash));
  }

  return { plain, keys, proto };
}

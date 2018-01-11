import { desc, keysOf, isFunction, isGetter, isObject, isSetter, isValue, error } from './misc'

export type EventType = 'value' | 'getter' | 'setter' | 'action' | 'global';

let _vue;

/**
 * Store
 *
 * @class Store
 * @template T
 */
export class Store<T extends { [key: string]: any }> {
  private _eventPool: { [key: string]: ((store: T, key: keyof T, ...args) => any)[] } = {
    value: [],
    getter: [],
    setter: [],
    action: [],
    global: []
  }

  private _storeEvent(type: EventType, store: T, key: keyof T, ...args) {
    this._eventPool[type].forEach(callback => callback(store, key, ...args));
  }

  private _strict: boolean = false;

  /**
   * Creates an instance of Store.
   * @param {(T | (new () => T) | (() => T))} target - can be a plain object, function that returns an object or a constructor function (class)
   * @param {{
   *       strict?: boolean, // - whether to disallow state modifications
   *       plugins?: ((this: Store<T>) => any)[], // - optional plugins to install
   *     }} options
   * @memberof Store
   */
  constructor(
    target: T | (new () => T) | (() => T),
    options?: {
      strict?: boolean,
      plugins?: ((this: Store<T>) => any)[],
    }
  ) {
    const { strict, plugins } = options || { strict: false, plugins: [] };

    this._strict = strict;

    this.replaceStore(target);
    plugins && plugins.forEach(plugin => plugin.apply(this));
  }

  public store: T = null;

  /**
   *
   *
   * @param {'value' | 'getter' | 'setter' | 'action' | 'global'} type
   * @param {(store: T, key: keyof T) => any} callback
   * @returns a funciton to unsubscribe from event
   * @memberof Tuex
   */
  public subscribe(type: EventType, callback: (store: T, key: keyof T, ...args) => any) {
    this._eventPool[type].push(callback);
    return () => {
      this._eventPool[type] = [...this._eventPool[type].filter(c => c != callback)];
    }
  }

  /** replaceStore
   *
   * A function that replaces the current store with the other one,
   * converting it from a target object/function/constructor
   *
   * @param {(T | (new () => T) | (() => T))} target
   * @memberof Tuex
   */
  public replaceStore(target: T | (new () => T) | (() => T)) {
    let plain: T;

    if (isFunction(target)) {
      try {
        plain = new (target as new () => T)();
      } catch (e) {
        plain = (target as () => T)();
      }
      this.store = this.objectToStore(plain, (target as new () => T));
    } else {
      plain = target as T;
      this.store = this.objectToStore(plain);
    }

    _vue && (_vue.prototype.$store = this.store);
  }

  /** objectToStore
   *
   * Converts a plain js object into a valid Tuex-store
   *
   * @param {T} plain - object to convert
   * @param {new () => T} [constructor] - constructor (if any)
   * @returns {T} - converted store
   * @memberof Tuex
   */
  public objectToStore(plain: T, constructor?: new () => T): T {
    const obj: T = {} as T;
    const keys = [].concat(keysOf(plain));

    if (isFunction(constructor))
      keys.push(...keysOf(constructor.prototype));

    for (let key of keys) {
      const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
      const descriptor = desc(plain, key) || desc(constructor.prototype, key);

      const callStoreEvent = (type: EventType, ...args) => this._storeEvent.call(this, type, plain, key, ...args);

      if (isFunction(plain[key])) {
        define({
          value() {
            callStoreEvent('action', ...[].concat(arguments));
            return (<any>plain)[key].apply(obj, arguments);
          }
        });
      }
      else if (isValue(descriptor)) {
        const isKeyObject = isObject(plain[key]);
        if (isKeyObject)
          plain[key] = this.objectToStore(plain[key]);

        define({
          enumerable: true,
          get: () => {
            callStoreEvent('value');
            return plain[key];
          },
          set: !this._strict ? value => {
            callStoreEvent('global', value);
            callStoreEvent('value', value);
            plain[key] = isKeyObject ? this.objectToStore(value) : value;
          } : () => error(
            'Explicit mutations of store values are prohibited!\nPlease, use setters instead or disable the [strict] flag!'
          )
        });
      }
      else if (isGetter(descriptor)) {
        define({
          get: () => {
            callStoreEvent('getter');
            return plain[key];
          }
        });
      }
      else if (isSetter(descriptor)) {
        define({
          set: value => {
            callStoreEvent('global', value);
            callStoreEvent('setter', value);
            plain[key] = value;
          }
        });
      }
      else if (process.env.NODE_ENV !== 'production') {
        console.error('Descriptor of ' + key + ' is wrong!');
      }
    }

    return obj;
  }
}

export function install(Vue) {
  if (_vue && Vue === _vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[tuex] is already installed. Vue.use(new Tuex(...)) should be called only once.'
      )
    }
    return;
  }
  _vue = Vue;
  _vue.prototype.$store = this.store;
}

import { desc, isFunction, isValue, isGetter, isSetter, isObject, keysOf } from "./util";
import { VueConstructor } from "vue/types/vue";
import {} from 'node';

export type EventType = 'value' | 'getter' | 'setter' | 'action' | 'global';

/**
 *
 *
 * @class Tuex
 * @template T
 */
export default class Tuex<T extends { [key: string]: any }> {
  private _vue: VueConstructor;

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
   * Creates an instance of Tuex.
   * @param {(T | (new () => T) | (() => T))} target - can be a plain object, function that returns an object or a constructor function (class)
   * @param {{
   *       strict?: boolean, // - whether to disallow state modifications
   *       plugins?: ((this: Tuex<T>) => any)[], // - optional plugins to install
   *     }} options
   * @memberof Tuex
   */
  constructor(
    target: T | (new () => T) | (() => T),
    options?: {
      strict?: boolean,
      plugins?: ((this: Tuex<T>) => any)[],
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
    } else {
      plain = target as T;
    }

    this.store = this.objectToStore(plain, (target as new () => T));
    this._vue && (this._vue.prototype.$store = this.store);

    // Object.defineProperty(this, 'store', {
    //   configurable: false,
    //   enumerable: true,
    //   get: () => plain,
    //   set: () => {
    //     if (process.env.NODE_ENV !== 'production') {
    //       console.error('Explicit assignment of store is prohibited!\nPlease, use replaceStore instead!');
    //     }
    //   }
    // })
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
    const $this = this;
    const obj: T = {} as T;
    const keys = [].concat(keysOf(plain));

    if (isFunction(constructor))
      keys.push(...keysOf(constructor.prototype));

    for (let key of keys) {
      const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
      const descriptor = desc(plain, key) || desc(constructor.prototype, key);

      if (isFunction(plain[key])) {
        define({
          configurable: false,
          enumerable: false,
          writable: false,
          value: function() {
            $this._storeEvent.call($this, 'action', plain, key, ...[].concat(arguments));
            return (<any>plain)[key].apply(obj, arguments);
          }
        });
      }
      else if (isValue(descriptor)) {
        const isKeyObject = isObject(plain[key]);
        if (isKeyObject)
          plain[key] = this.objectToStore(plain[key], undefined);

        define({
          configurable: false,
          enumerable: true,
          get: () => {
            $this._storeEvent.call($this, 'value', plain, key);
            return plain[key];
          },
          set: !$this._strict ? value => {
            $this._storeEvent.call($this, 'global', plain, key, value);
            $this._storeEvent.call($this, 'value', plain, key, value);
            plain[key] = isKeyObject ? this.objectToStore(value, undefined) : value;
          } : () => {
            if (process.env.NODE_ENV !== 'production') {
              console.error('Explicit mutations of store values are prohibited!\nPlease, use setters instead or disable the [immutableState] flag!');
            }
          }
        });
      }
      else if (isGetter(descriptor)) {
        define({
          configurable: false,
          enumerable: false,
          get: () => {
            $this._storeEvent.call($this, 'getter', plain, key);
            return plain[key];
          }
        });
      }
      else if (isSetter(descriptor)) {
        define({
          configurable: false,
          enumerable: false,
          set: value => {
            $this._storeEvent.call($this, 'global', plain, key, value);
            $this._storeEvent.call($this, 'setter', plain, key, value);
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

  public install(Vue: VueConstructor) {
    if (this._vue && Vue === this._vue) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          '[tuex] is already installed. Vue.use(new Tuex(...)) should be called only once.'
        )
      }
      return;
    }
    this._vue = Vue;
    this._vue.prototype.$store = this.store;
  }
}

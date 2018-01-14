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

  private _storeEvent(type: EventType, store: T, key: string, ...args) {
    for (var i = 0; i < this._eventPool[type].length; i++)
      this._eventPool[type][i](store, key, ...args);
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

  private _store: { state: T } = { state: null };

  public get store(): T {
    return this._store.state;
  }

  public set store(value) {
    error(`Can't assign ${value} to store:
Explicit store assignment is prohibited! Consider using [replaceStore] instead!`);
  }

  /**
   * Subscribe for store events.
   * Callback is executed BEFORE the event!
   *
   * @param {'value' | 'getter' | 'setter' | 'action' | 'global'} type
   * @param {(store: T, key: string) => any} callback
   * @returns a funciton to unsubscribe from event
   * @memberof Tuex
   */
  public subscribe(type: EventType, callback: (store: T, key: string, ...args) => any) {
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
      this._store.state = this.objectToStore(plain, (target as new () => T));
    } else {
      plain = target as T;
      this._store.state = this.objectToStore(plain);
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
    const keys = keysOf(plain);

    if (isFunction(constructor))
      keys.push(...keysOf(constructor.prototype));

    for (let key of keys) {
      if (obj[key] !== undefined || key === 'constructor') {
        (key !== 'constructor') && error(`Can't redefine '${key}'! Key is already defined!`);
        continue;
      }

      const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
      const descriptor = desc(plain, key) || desc(constructor.prototype, key);

      const callStoreEvent = (type: EventType, ...args) => this._storeEvent.call(this, type, plain, key, ...args);

      if (isFunction(plain[key])) define({
        value() {
          var args = new Array(arguments.length),
             _args = new Array(arguments.length + 1);

          _args[0] = 'action';

          for (var i = 0; i < arguments.length; i++)
            _args[i + 1] = args[i] = arguments[i];

          callStoreEvent.apply(void 0, _args);
          return (<any>plain)[key].apply(obj, args);
        }
      });
      else if (isValue(descriptor)) {
        let get, set;

        if (descriptor.get)
          get = () => {
            callStoreEvent('value');
            return descriptor.get.call(obj);
          }
        else
          get = () => {
            callStoreEvent('value');
            return plain[key];
          }

        if (descriptor.set && !this._strict)
          set = value => {
            callStoreEvent('global', value);
            callStoreEvent('value', value);
            descriptor.set.call(obj, value);
          }
        else if (!this._strict) {
          if (isObject(descriptor)) {
            plain[key] = this.objectToStore(plain[key]);
            Object.defineProperty(plain[key], '$root', desc(this, 'store'));

            set = value => {
              callStoreEvent('global', value);
              callStoreEvent('value', value);
              plain[key] = this.objectToStore(value);
              Object.defineProperty(plain[key], '$root', desc(this, 'store'));
            }
          } else set = value => {
            callStoreEvent('global', value);
            callStoreEvent('value', value);
            plain[key] = value;
          }
        } else
          set = () => error(
            'Explicit mutations of `' + key + '` are prohibited!\nPlease, use setters instead or disable the [strict] flag!'
          );

        define({ enumerable: true, get, set });
      }
      else if (isGetter(descriptor)) define({
        get: () => {
          callStoreEvent('getter');
          return descriptor.get.call(obj);
        }
      });
      else if (isSetter(descriptor)) define({
        set: value => {
          callStoreEvent('global', value);
          callStoreEvent('setter', value);
          descriptor.set.call(obj, value);
        }
      });
      else error('Descriptor of `' + key + '` has niether getter, setter nor value!');
    }

    return Object.seal(obj);
  }
}

export function install(Vue) {
  if (_vue && Vue === _vue) {
    error('[tuex] is already installed. Vue.use(Tuex) should be called only once.')
    return;
  }
  _vue = Vue;
}

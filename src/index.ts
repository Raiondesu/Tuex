import { Plugin, Type } from "./types";
import { desc, isFunction, isValue, isGetter, isSetter } from "./util";
import { VueConstructor } from "vue/types/vue";
import {} from 'node';


/**
 *
 *
 * @class Tuex
 * @template T
 */
export default class Tuex<T extends { [key: string]: any }> {
  private store: T = null;

  private vue: VueConstructor;

  private eventPool: { [key: string]: ((store: T, key: keyof T, ...args) => any)[] } = {
    value: [],
    getter: [],
    setter: [],
    action: [],
    global: []
  }

	private storeEvent(type: Type, store: T, key: keyof T, ...args) {
		this.eventPool[type].forEach(callback => callback(store, key, ...args));
	}

  /**
   * Creates an instance of Tuex.
   * @param {((new () => T) | (() => T) | T)} target - can be a plain object, function that returns an object or a constructor function (class)
   * @param {Plugin<T>[]} plugins - optional plugins to install
   * @memberof Store
   */
  constructor(
    target: T | (new () => T) | (() => T),
    plugins?: Plugin<T>[],
  ) {
    this.replaceStore(target);

    plugins && plugins.forEach(plugin => plugin.apply(this));
  }

  /**
   *
   *
   * @param {'value' | 'getter' | 'setter' | 'action' | 'global'} type
   * @param {(store: T, key: keyof T) => any} callback
   * @returns a funciton to unsubscribe from event
   * @memberof Tuex
   */
  public subscribe(type: Type, callback: (store: T, key: keyof T) => any) {
    this.eventPool[type].push(callback);
    return () => {
      this.eventPool[type] = [...this.eventPool[type].filter(c => c != callback)];
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

    this.store = this.objectToStore(plain);
  }

  /** objectToStore
   *
   * Converts a plain js object into a valid Tuex-store
   *
   * TODO: make recursive for object values
   *
   * @param {T} plain - object to convert
   * @param {new () => T} [constructor] - constructor (if any)
   * @returns {T} - converted store
   * @memberof Tuex
   */
  public objectToStore(plain: T, constructor?: new () => T): T {
    const $this = this;

    const obj: T = {} as T;
    for (let key in plain) {
      const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
      const descriptor = desc(plain, key) || desc(constructor.prototype, key);

      if (isFunction(plain[key]))
        define({
          configurable: false,
          enumerable: false,
          writable: false,
          value: function() {
            $this.storeEvent.call($this, 'action', plain, key, ...[].concat(arguments));
            return (<any>plain)[key].apply(plain, arguments);
          }
        });
      else if (isValue(descriptor))
        define({
          configurable: false,
          enumerable: true,
          get: () => {
            $this.storeEvent.call($this, 'value', plain, key);
            return plain[key];
          },
          set: value => {
            $this.storeEvent.call($this, 'value', plain, key, value);
            $this.storeEvent.call($this, 'global', plain, key, value);
            plain[key] = value;
          }
        });
      else if (isGetter(descriptor))
        define({
          configurable: false,
          enumerable: false,
          get: () => {
            $this.storeEvent.call($this, 'getter', plain, key);
            return plain[key];
          }
        });
      else if (isSetter(descriptor))
        define({
          configurable: false,
          enumerable: false,
          set: value => {
            $this.storeEvent.call($this, 'setter', plain, key, value);
            $this.storeEvent.call($this, 'global', plain, key, value);
            plain[key] = value;
          }
        });
      else if (process.env.NODE_ENV !== 'production')
        console.error('Descriptor of ' + key + ' is wrong');
    }

    return obj;
  }

  public install(Vue: VueConstructor) {
    if (this.vue && Vue === this.vue) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          '[tuex] is already installed. Vue.use(new Tuex(...)) should be called only once.'
        )
      }
      return;
    }
    this.vue = Vue;
    this.vue.prototype.$store = this.store;
  }
}

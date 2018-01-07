/** Tuex v0.0.0
 * (c) Raiondesu 2018
 * @license MIT
 */

import { VueConstructor } from 'vue/types/vue';
import { Plugin, Type } from './types';

const desc = Object.getOwnPropertyDescriptor;

const pool: { [key: string]: ((store, key, ...args) => any)[] } = {
	value: [],
	getter: [],
	setter: [],
	action: []
}

var _store;
var Vue;

/**
 * @export Tuex decorator
 * @param {object} plugins - plugins to add
 * @param {object} plain - object to convert
 * @returns Installable Vue plugin
 */
export default function Tuex<T>(plugins: Plugin<T>[]) { return function (target: (new () => T) | (() => T) | T) {
	const obj: T = {} as T;
	let plain: T;
	let targetConstructor = (target as new () => T);
	let targetFunction = (target as () => T);

	function subscribe(type: Type, callback: (store: T, key: keyof T) => any) {
		pool[type].push(callback);
	}

	function StoreEvent(type: Type, store: T, key: keyof T, ...args) {
		pool[type].forEach(callback => callback(store, key, ...args));
	}

	function replaceStore(store: T) {
		_store = store;
	}

  if (typeof target === 'function') {
		try {
      plain = new targetConstructor();
    } catch (e) {
      plain = targetFunction();
    }
  } else {
    plain = target as T;
  }

	for (let key in plain) {
		const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
    const descriptor = desc(plain, key) || desc(targetConstructor.prototype, key);
	
		if (plain[key] instanceof Function)
			define({
				configurable: false,
				enumerable: false,
				writable: false,
				value: function() {
					StoreEvent('action', obj, key, ...arguments);
					return (<any>plain)[key](arguments);
				}
			});
		else if (!descriptor.get && !descriptor.set)
			define({
				configurable: false,
				enumerable: true,
				get: () => {
					return plain[key];
				},
				set: value => {
					StoreEvent('value', obj, key, value);
					plain[key] = value;
				}
			});
		else if (descriptor.get && !descriptor.set)
			define({
				configurable: false,
				enumerable: false,
				get: () => {
					StoreEvent('getter', obj, key);
					return plain[key];
				}
			});
		else if (!descriptor.get && descriptor.set)
			define({
				configurable: false,
				enumerable: false,
				set: value => {
					StoreEvent('setter', obj, key, value);
					plain[key] = value;
				}
			});
	}

	return {
		install(_Vue: VueConstructor) {
			Vue = _Vue;
      _store = Vue.prototype.$store = obj;
      plugins && plugins.forEach(install => install(_store, {
				subscribe,
				replaceStore
			}));
		}
	};
}}
/** Tuex v0.0.0
 * (c) Raiondesu 2018
 * @license MIT
 */

import { VueConstructor } from 'vue/types/vue';

const desc = Object.getOwnPropertyDescriptor;

type Plugin<T> = (state: T, subscribe) => any;

function subscribe(callback: (setter, store) => any) {
  console.log(callback);
}

/**
 * @export Tuex decorator
 * @param {object} plugins - plugins to add
 * @param {object} plain - object to convert
 * @returns Installable Vue plugin
 */
export default function Tuex<T>(plugins: Plugin<T>[]) { return function (target: any) {
  const obj = {};
  let plain;

  if (typeof target === 'function') {
    try {
      plain = new target();
    } catch (e) {
      plain = target();
    }
  } else {
    plain = target;
  }

	for (let key in plain) {
		const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
    const descriptor = desc(plain, key) || desc(target.prototype, key);
	
		if (plain[key] instanceof Function)
			define({
				configurable: false,
				enumerable: false,
				writable: false,
				value: function() {
					console.log('Called ' + [plain] + '.' + key + ' function with ' + arguments.length + ' arguments');
					return (<any>plain)[key](arguments);
				}
			});
		else if (!descriptor.get && !descriptor.set)
			define({
				configurable: false,
				enumerable: true,
				get: () => {
					console.log('Accessing property ' + key);
					return plain[key];
				},
				set: value => {
					console.log('Assigning property ' + key + ' with value of ' + value);
					plain[key] = value;
				}
			});
		else if (descriptor.get && !descriptor.set)
			define({
				configurable: false,
				enumerable: false,
				get: () => {
					console.log('Accessing getter ' + key);
					return plain[key];
				}
			});
		else if (!descriptor.get && descriptor.set)
			define({
				configurable: false,
				enumerable: false,
				set: value => {
					console.log('Assigning value ' + value + ' to setter ' + key);
					plain[key] = value;
				}
			});
	}

	return {
		install(Vue: VueConstructor) {
      Vue.prototype.$store = obj;
      plugins && plugins.forEach(plugin => plugin(Vue.prototype.$store, subscribe));
		}
	};
}}
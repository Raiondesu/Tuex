/** (c) Raiondesu
 * @license MIT
 */

import { VueConstructor } from 'vue/types/vue';

const desc = Object.getOwnPropertyDescriptor;

export type Plugin<T> = (state: T) => any; 

/**
 * @export Tuex decorator
 * @param {object} plugins - plugins to add
 * @param {object} plain - object to convert
 * @returns Installable Vue plugin
 */
export default <T>(plugins: Plugin<T>[]) => (plain: T) => {
	console.log(plugins);
	const obj = {};

	for (const key in plain) {
		const define = (prop: PropertyDescriptor) => Object.defineProperty(obj, key, prop);
		const descriptor = desc(plain, key);
	
		if (plain[key] instanceof Function)
			define({
				configurable: false,
				enumerable: false,
				writable: false,
				value: function() {
					console.log('Called ' + [plain] + '.' + key + ' function with ' + arguments.length + ' arguments');
					return (<any>plain)[key](arguments);
				}
			})
		else if (!descriptor.get && !descriptor.set)
			define({
				configurable: false,
				enumerable: true,
				get: () => {
					console.log('Accessing ' + [plain] + '.' + key + ' property');
					return plain[key];
				},
				set: value => {
					console.log('Assigning ' + value + ' to ' + [plain] + '.' + key + ' property');
					plain[key] = value;
				}
			});
			
		else if (descriptor.get && !descriptor.set)
			define({
				configurable: false,
				enumerable: false,
				get: () => {
					console.log('Accessed ' + [plain] + '.' + key + ' getter');
					return plain[key];
				}
			})
			
		else if (!descriptor.get && descriptor.set)
			define({
				configurable: false,
				enumerable: false,
				set: (value) => {
					console.log('Assigned ' + value + ' to ' + [plain] + '.' + key + ' setter');
					plain[key] = value;
				}
			})
	}

	return {
		install(Vue: VueConstructor) {
			Vue.prototype.$state = obj;
		}
	};
}
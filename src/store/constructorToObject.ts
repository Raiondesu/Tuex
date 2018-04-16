import { isFunction, keysOf } from '../misc'

export function constructorToObject<T>(target: T | (new () => T)) {
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
	  const trash = (key: string) => !~[
		  'constructor'
	  ].indexOf(key);

	  keys.push(...keysOf<T>(proto).filter(trash));
	}

	return { plain, keys, proto };
}

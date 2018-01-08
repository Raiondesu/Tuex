export const desc = Object.getOwnPropertyDescriptor;

export function isObject(obj) {
  return !!obj && typeof obj === 'object';
}

export function isFunction(fn) {
  return !!fn && (fn instanceof Function || typeof fn === 'function');
}

export function isPromise(value) {
  return !!value && isFunction(value.then);
}

export function isValue(descriptor: PropertyDescriptor) {
  return !!descriptor && !isFunction(descriptor.value) && !descriptor.get && !descriptor.set;
}

export function isGetter(descriptor: PropertyDescriptor) {
  return !!descriptor && !descriptor.value && descriptor.get && !descriptor.set;
}

export function isSetter(descriptor: PropertyDescriptor) {
  return !!descriptor && !descriptor.value && descriptor.get && !descriptor.set;
}

import {} from 'node';

export const desc = Object.getOwnPropertyDescriptor as (<T>(obj: T, key: keyof T) => PropertyDescriptor);
export const keysOf = Object.getOwnPropertyNames as (<T>(obj: T) => (keyof T)[]);

export const isObject = (descriptor: PropertyDescriptor) =>
  Object.prototype.toString.apply(descriptor.value) === '[object Object]';

export const isFunction = (descriptor: PropertyDescriptor) => {
  const fn = descriptor.value;
  return !!fn && (fn instanceof Function || typeof fn === 'function');
}

export const isValue = (descriptor: PropertyDescriptor) => {
  return !!(!!descriptor && (
    (!isFunction(descriptor) && !descriptor.get && !descriptor.set)
    || (!descriptor.value && descriptor.get && descriptor.set))
  );
}

export const isGetter = (descriptor: PropertyDescriptor) => {
  return !!descriptor && !!descriptor.get && !descriptor.set;
}

export const isSetter = (descriptor: PropertyDescriptor) => {
  return !!descriptor && !descriptor.get && !!descriptor.set;
}

export const error = (message: string) => {
  if (process && process.env.NODE_ENV !== 'production') {
    return console.error('[Tuex warn] ' + message);
  }
}

export function fromPath<T>(obj: T, path: string): any {
  if (!path || !(/\w+((\.|\/)\w+)*/.test(path)))
    return obj;

  // Support system-like paths
  path = path.replace(/\//g, '.');

  return path.split('.').reduce((o, i) => isObject({ value: o }) ? (o[i] || o) : o, obj);
}

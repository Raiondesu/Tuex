import {} from 'node';

export const desc = Object.getOwnPropertyDescriptor as (<T>(obj: T, key: keyof T) => PropertyDescriptor);
export const keysOf = Object.getOwnPropertyNames as (<T>(obj: T) => (keyof T)[]);

export const isObject = (obj) =>
  !!obj && Object.prototype.toString.apply(obj) === '[object Object]';

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

export function pathValue(obj, path: string | string[], value = undefined) {
  if (typeof path === 'string') path = path.split(/[\./]/g);

  return internalPathValue(obj, path, value, value === undefined);
}

function internalPathValue(obj, path: string[], value = undefined, isGetting) {
  const key = path[0];

  let isObj = isObject(obj);
  let hasKey = obj && key && obj[key];
  let objAndHasKey = isObj && hasKey;

  if (objAndHasKey && (path.length - 1)) {
    path.shift();
    return internalPathValue(obj[key], path, value, isGetting);
  } else if (key) {
    return isGetting ? obj[key] : obj[key] = value;
  } else if (!isGetting) {
    return value;
  } else return obj;
}

export const desc = Object.getOwnPropertyDescriptor;
export const keysOf = Object.getOwnPropertyNames;

export const isObject = (descriptor) => {
  const obj = descriptor.value
  
  if (!!obj)
    return Object.prototype.toString.apply(obj) === '[object Object]';
  else
    return false;
}

export const isFunction = (fn) => {
  return !!fn && (fn instanceof Function || typeof fn === 'function');
}

export const isPromise = (value) => {
  return !!value && isFunction(value.then);
}

export const isValue = (descriptor: PropertyDescriptor) => {
  return !!descriptor && (
    (!isFunction(descriptor.value) && !descriptor.get && !descriptor.set)
    || (!descriptor.value && descriptor.get && descriptor.set)
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
    console.error(message);
  }
}

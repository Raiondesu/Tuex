"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.desc = Object.getOwnPropertyDescriptor;
function isObject(obj) {
    return !!obj && typeof obj === 'object';
}
exports.isObject = isObject;
function isFunction(fn) {
    return !!fn && (fn instanceof Function || typeof fn === 'function');
}
exports.isFunction = isFunction;
function isPromise(value) {
    return !!value && isFunction(value.then);
}
exports.isPromise = isPromise;
function isValue(descriptor) {
    return !!descriptor && !isFunction(descriptor.value) && !descriptor.get && !descriptor.set;
}
exports.isValue = isValue;
function isGetter(descriptor) {
    return !!descriptor && !descriptor.value && descriptor.get && !descriptor.set;
}
exports.isGetter = isGetter;
function isSetter(descriptor) {
    return !!descriptor && !descriptor.value && descriptor.get && !descriptor.set;
}
exports.isSetter = isSetter;

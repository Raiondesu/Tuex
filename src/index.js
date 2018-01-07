"use strict";
/** Tuex v0.0.0
 * (c) Raiondesu 2018
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var desc = Object.getOwnPropertyDescriptor;
function subscribe(callback) {
    console.log(callback);
}
/**
 * @export Tuex decorator
 * @param {object} plugins - plugins to add
 * @param {object} plain - object to convert
 * @returns Installable Vue plugin
 */
function Tuex(plugins) {
    return function (target) {
        var obj = {};
        var plain;
        if (typeof target === 'function') {
            try {
                plain = new target();
            }
            catch (e) {
                plain = target();
            }
        }
        else {
            plain = target;
        }
        var _loop_1 = function (key) {
            var define = function (prop) { return Object.defineProperty(obj, key, prop); };
            var descriptor = desc(plain, key) || desc(target.prototype, key);
            if (plain[key] instanceof Function)
                define({
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: function () {
                        console.log('Called ' + [plain] + '.' + key + ' function with ' + arguments.length + ' arguments');
                        return plain[key](arguments);
                    }
                });
            else if (!descriptor.get && !descriptor.set)
                define({
                    configurable: false,
                    enumerable: true,
                    get: function () {
                        console.log('Accessing property ' + key);
                        return plain[key];
                    },
                    set: function (value) {
                        console.log('Assigning property ' + key + ' with value of ' + value);
                        plain[key] = value;
                    }
                });
            else if (descriptor.get && !descriptor.set)
                define({
                    configurable: false,
                    enumerable: false,
                    get: function () {
                        console.log('Accessing getter ' + key);
                        return plain[key];
                    }
                });
            else if (!descriptor.get && descriptor.set)
                define({
                    configurable: false,
                    enumerable: false,
                    set: function (value) {
                        console.log('Assigning value ' + value + ' to setter ' + key);
                        plain[key] = value;
                    }
                });
        };
        for (var key in plain) {
            _loop_1(key);
        }
        return {
            install: function (Vue) {
                Vue.prototype.$store = obj;
                plugins && plugins.forEach(function (plugin) { return plugin(Vue.prototype.$store, subscribe); });
            }
        };
    };
}
exports.default = Tuex;

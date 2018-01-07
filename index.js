"use strict";
/** (c) Raiondesu
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var desc = Object.getOwnPropertyDescriptor;
/**
 * @export Tuex decorator
 * @param {object} plugins - plugins to add
 * @param {object} plain - object to convert
 * @returns Installable Vue plugin
 */
exports.default = function (plugins) { return function (plain) {
    console.log(plugins);
    var obj = {};
    var _loop_1 = function (key) {
        var define = function (prop) { return Object.defineProperty(obj, key, prop); };
        var descriptor = desc(plain, key);
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
                    console.log('Accessing ' + [plain] + '.' + key + ' property');
                    return plain[key];
                },
                set: function (value) {
                    console.log('Assigning ' + value + ' to ' + [plain] + '.' + key + ' property');
                    plain[key] = value;
                }
            });
        else if (descriptor.get && !descriptor.set)
            define({
                configurable: false,
                enumerable: false,
                get: function () {
                    console.log('Accessed ' + [plain] + '.' + key + ' getter');
                    return plain[key];
                }
            });
        else if (!descriptor.get && descriptor.set)
            define({
                configurable: false,
                enumerable: false,
                set: function (value) {
                    console.log('Assigned ' + value + ' to ' + [plain] + '.' + key + ' setter');
                    plain[key] = value;
                }
            });
    };
    for (var key in plain) {
        _loop_1(key);
    }
    return {
        install: function (Vue) {
            Vue.prototype.$state = obj;
        }
    };
}; };

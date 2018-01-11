/**
* Tuex v0.3.5
* (c) 2018 Alexey Iskhakov
* @license MIT
*/


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Tuex = {})));
}(this, (function (exports) { 'use strict';

var desc = Object.getOwnPropertyDescriptor;
var keysOf = Object.getOwnPropertyNames;
var isObject = function (obj) {
    return !!obj && Object.prototype.toString.apply(obj) === '[object Object]';
};
var isFunction = function (fn) {
    return !!fn && (fn instanceof Function || typeof fn === 'function');
};

var isValue = function (descriptor) {
    return !!descriptor && ((!isFunction(descriptor.value) && !descriptor.get && !descriptor.set)
        || (!descriptor.value && descriptor.get && descriptor.set));
};
var isGetter = function (descriptor) {
    return !!descriptor && descriptor.get && !descriptor.set;
};
var isSetter = function (descriptor) {
    return !!descriptor && !descriptor.get && descriptor.set;
};
var error = function (message) {
    if (process.env.NODE_ENV !== 'production') {
        console.error(message);
    }
};

var _vue;
/**
 * Store
 *
 * @class Store
 * @template T
 */
var Store = /** @class */ (function () {
    /**
     * Creates an instance of Store.
     * @param {(T | (new () => T) | (() => T))} target - can be a plain object, function that returns an object or a constructor function (class)
     * @param {{
     *       strict?: boolean, // - whether to disallow state modifications
     *       plugins?: ((this: Store<T>) => any)[], // - optional plugins to install
     *     }} options
     * @memberof Store
     */
    function Store(target, options) {
        var _this = this;
        this._eventPool = {
            value: [],
            getter: [],
            setter: [],
            action: [],
            global: []
        };
        this._strict = false;
        this._store = { state: null };
        var _a = options || { strict: false, plugins: [] }, strict = _a.strict, plugins = _a.plugins;
        this._strict = strict;
        this.replaceStore(target);
        var pluginOptions = {
            replaceStore: function (_target) {
                return _this.replaceStore(_target);
            },
            subscribe: function (type, callback) {
                return _this.subscribe(type, callback);
            },
        };
        Object.defineProperty(pluginOptions, 'store', Object.getOwnPropertyDescriptor(Store.prototype, 'store'));
        plugins && plugins.forEach(function (plugin) { return plugin.apply(pluginOptions); });
    }
    Store.prototype._storeEvent = function (type, store, key) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        this._eventPool[type].forEach(function (callback) { return callback.apply(void 0, [store, key].concat(args)); });
    };
    Object.defineProperty(Store.prototype, "store", {
        get: function () {
            return this._store.state;
        },
        set: function (value) {
            error("Can't assign " + value + " to store:\nExplicit store assignment is prohibited! Consider using [replaceStore] instead!");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribe for store events.
     * Callback is executed BEFORE the event!
     *
     * @param {'value' | 'getter' | 'setter' | 'action' | 'global'} type
     * @param {(store: T, key: keyof T) => any} callback
     * @returns a funciton to unsubscribe from event
     * @memberof Tuex
     */
    Store.prototype.subscribe = function (type, callback) {
        var _this = this;
        this._eventPool[type].push(callback);
        return function () {
            _this._eventPool[type] = _this._eventPool[type].filter(function (c) { return c != callback; }).slice();
        };
    };
    /** replaceStore
     *
     * A function that replaces the current store with the other one,
     * converting it from a target object/function/constructor
     *
     * @param {(T | (new () => T) | (() => T))} target
     * @memberof Tuex
     */
    Store.prototype.replaceStore = function (target) {
        var plain;
        if (isFunction(target)) {
            try {
                plain = new target();
            }
            catch (e) {
                plain = target();
            }
            this._store.state = this.objectToStore(plain, target);
        }
        else {
            plain = target;
            this._store.state = this.objectToStore(plain);
        }
        _vue && (_vue.prototype.$store = this.store);
    };
    /** objectToStore
     *
     * Converts a plain js object into a valid Tuex-store
     *
     * @param {T} plain - object to convert
     * @param {new () => T} [constructor] - constructor (if any)
     * @returns {T} - converted store
     * @memberof Tuex
     */
    Store.prototype.objectToStore = function (plain, constructor) {
        var _this = this;
        var obj = {};
        var keys = [].concat(keysOf(plain));
        if (isFunction(constructor))
            keys.push.apply(keys, keysOf(constructor.prototype));
        var _loop_1 = function (key) {
            var define = function (prop) { return Object.defineProperty(obj, key, prop); };
            var descriptor = desc(plain, key) || desc(constructor.prototype, key);
            var callStoreEvent = function (type) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return (_a = _this._storeEvent).call.apply(_a, [_this, type, plain, key].concat(args));
                var _a;
            };
            if (isFunction(plain[key]))
                define({
                    value: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        callStoreEvent.apply(void 0, ['action'].concat(args));
                        return plain[key].apply(obj, args);
                    }
                });
            else if (isValue(descriptor)) {
                var isKeyObject_1 = isObject(plain[key]);
                if (isKeyObject_1)
                    plain[key] = this_1.objectToStore(plain[key]);
                define({
                    enumerable: true,
                    get: function () {
                        callStoreEvent('value');
                        return plain[key];
                    },
                    set: !this_1._strict ? function (value) {
                        callStoreEvent('global', value);
                        callStoreEvent('value', value);
                        plain[key] = isKeyObject_1 ? _this.objectToStore(value) : value;
                    } : function () { return error('Explicit mutations of store values are prohibited!\nPlease, use setters instead or disable the [strict] flag!'); }
                });
            }
            else if (isGetter(descriptor))
                define({
                    get: function () {
                        callStoreEvent('getter');
                        return plain[key];
                    }
                });
            else if (isSetter(descriptor))
                define({
                    set: function (value) {
                        callStoreEvent('global', value);
                        callStoreEvent('setter', value);
                        plain[key] = value;
                    }
                });
            else
                error('Descriptor of ' + key + ' is wrong!');
        };
        var this_1 = this;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _loop_1(key);
        }
        return obj;
    };
    return Store;
}());
function install(Vue) {
    if (_vue && Vue === _vue) {
        error('[tuex] is already installed. Vue.use(Tuex) should be called only once.');
        return;
    }
    _vue = Vue;
    _vue.prototype.$store = this.store;
}


var Tuex = Object.freeze({
	Store: Store,
	install: install
});

module.exports = Tuex;

Object.defineProperty(exports, '__esModule', { value: true });

})));

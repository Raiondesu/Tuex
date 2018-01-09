"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 *
 *
 * @class Tuex
 * @template T
 */
var Tuex = /** @class */ (function () {
    /**
     * Creates an instance of Tuex.
     * @param {(T | (new () => T) | (() => T))} target - can be a plain object, function that returns an object or a constructor function (class)
     * @param {{
     *       strict?: boolean, // - whether to disallow state modifications
     *       plugins?: ((this: Tuex<T>) => any)[], // - optional plugins to install
     *     }} options
     * @memberof Tuex
     */
    function Tuex(target, options) {
        var _this = this;
        this._eventPool = {
            value: [],
            getter: [],
            setter: [],
            action: [],
            global: []
        };
        this._strict = false;
        this.store = null;
        var _a = options || { strict: false, plugins: [] }, strict = _a.strict, plugins = _a.plugins;
        this._strict = strict;
        this.replaceStore(target);
        plugins && plugins.forEach(function (plugin) { return plugin.apply(_this); });
    }
    Tuex.prototype._storeEvent = function (type, store, key) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        this._eventPool[type].forEach(function (callback) { return callback.apply(void 0, [store, key].concat(args)); });
    };
    /**
     *
     *
     * @param {'value' | 'getter' | 'setter' | 'action' | 'global'} type
     * @param {(store: T, key: keyof T) => any} callback
     * @returns a funciton to unsubscribe from event
     * @memberof Tuex
     */
    Tuex.prototype.subscribe = function (type, callback) {
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
    Tuex.prototype.replaceStore = function (target) {
        var plain;
        if (util_1.isFunction(target)) {
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
        this.store = this.objectToStore(plain, target);
        this._vue && (this._vue.prototype.$store = this.store);
        // Object.defineProperty(this, 'store', {
        //   configurable: false,
        //   enumerable: true,
        //   get: () => plain,
        //   set: () => {
        //     if (process.env.NODE_ENV !== 'production') {
        //       console.error('Explicit assignment of store is prohibited!\nPlease, use replaceStore instead!');
        //     }
        //   }
        // })
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
    Tuex.prototype.objectToStore = function (plain, constructor) {
        var _this = this;
        var $this = this;
        var obj = {};
        var keys = [].concat(util_1.keysOf(plain));
        if (util_1.isFunction(constructor))
            keys.push.apply(keys, util_1.keysOf(constructor.prototype));
        var _loop_1 = function (key) {
            var define = function (prop) { return Object.defineProperty(obj, key, prop); };
            var descriptor = util_1.desc(plain, key) || util_1.desc(constructor.prototype, key);
            if (util_1.isFunction(plain[key])) {
                define({
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: function () {
                        (_a = $this._storeEvent).call.apply(_a, [$this, 'action', plain, key].concat([].concat(arguments)));
                        return plain[key].apply(obj, arguments);
                        var _a;
                    }
                });
            }
            else if (util_1.isValue(descriptor)) {
                var isKeyObject_1 = util_1.isObject(plain[key]);
                if (isKeyObject_1)
                    plain[key] = this_1.objectToStore(plain[key], undefined);
                define({
                    configurable: false,
                    enumerable: true,
                    get: function () {
                        $this._storeEvent.call($this, 'value', plain, key);
                        return plain[key];
                    },
                    set: !$this._strict ? function (value) {
                        $this._storeEvent.call($this, 'global', plain, key, value);
                        $this._storeEvent.call($this, 'value', plain, key, value);
                        plain[key] = isKeyObject_1 ? _this.objectToStore(value, undefined) : value;
                    } : function () {
                        if (process.env.NODE_ENV !== 'production') {
                            console.error('Explicit mutations of store values are prohibited!\nPlease, use setters instead or disable the [immutableState] flag!');
                        }
                    }
                });
            }
            else if (util_1.isGetter(descriptor)) {
                define({
                    configurable: false,
                    enumerable: false,
                    get: function () {
                        $this._storeEvent.call($this, 'getter', plain, key);
                        return plain[key];
                    }
                });
            }
            else if (util_1.isSetter(descriptor)) {
                define({
                    configurable: false,
                    enumerable: false,
                    set: function (value) {
                        $this._storeEvent.call($this, 'global', plain, key, value);
                        $this._storeEvent.call($this, 'setter', plain, key, value);
                        plain[key] = value;
                    }
                });
            }
            else if (process.env.NODE_ENV !== 'production') {
                console.error('Descriptor of ' + key + ' is wrong!');
            }
        };
        var this_1 = this;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _loop_1(key);
        }
        return obj;
    };
    Tuex.prototype.install = function (Vue) {
        if (this._vue && Vue === this._vue) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('[tuex] is already installed. Vue.use(new Tuex(...)) should be called only once.');
            }
            return;
        }
        this._vue = Vue;
        this._vue.prototype.$store = this.store;
    };
    return Tuex;
}());
exports.default = Tuex;

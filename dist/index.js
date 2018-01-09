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
     * @param {((new () => T) | (() => T) | T)} target - can be a plain object, function that returns an object or a constructor function (class)
     * @param {Plugin<T>[]} plugins - optional plugins to install
     * @memberof Store
     */
    function Tuex(target, options) {
        var _this = this;
        this.eventPool = {
            value: [],
            getter: [],
            setter: [],
            action: [],
            global: []
        };
        this.store = null;
        var strict = options.strict, plugins = options.plugins;
        this.replaceStore(target, strict || false);
        plugins && plugins.forEach(function (plugin) { return plugin.apply(_this); });
    }
    Tuex.prototype.storeEvent = function (type, store, key) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        this.eventPool[type].forEach(function (callback) { return callback.apply(void 0, [store, key].concat(args)); });
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
        this.eventPool[type].push(callback);
        return function () {
            _this.eventPool[type] = _this.eventPool[type].filter(function (c) { return c != callback; }).slice();
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
    Tuex.prototype.replaceStore = function (target, makeImmutable) {
        if (makeImmutable === void 0) { makeImmutable = false; }
        var plain;
        if (util_1.isFunction(target)) {
            try {
                plain = new target();
                this.store = this.objectToStore(plain, target, makeImmutable);
            }
            catch (e) {
                plain = target();
            }
        }
        else {
            plain = target;
        }
        this.store = this.objectToStore(plain, undefined, makeImmutable);
    };
    /** objectToStore
     *
     * Converts a plain js object into a valid Tuex-store
     *
     * TODO: make recursive for object values
     *
     * @param {T} plain - object to convert
     * @param {new () => T} [constructor] - constructor (if any)
     * @returns {T} - converted store
     * @memberof Tuex
     */
    Tuex.prototype.objectToStore = function (plain, constructor, immutableState) {
        var _this = this;
        if (immutableState === void 0) { immutableState = false; }
        var $this = this;
        var obj = {};
        var _loop_1 = function (key) {
            var define = function (prop) { return Object.defineProperty(obj, key, prop); };
            var descriptor = util_1.desc(plain, key) || util_1.desc(constructor.prototype, key);
            if (util_1.isFunction(plain[key])) {
                define({
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: function () {
                        (_a = $this.storeEvent).call.apply(_a, [$this, 'action', plain, key].concat([].concat(arguments)));
                        return plain[key].apply(obj, arguments);
                        var _a;
                    }
                });
            }
            else if (util_1.isValue(descriptor)) {
                var isKeyObject_1 = util_1.isObject(plain[key]);
                if (isKeyObject_1)
                    plain[key] = this_1.objectToStore(plain[key], undefined, immutableState);
                define({
                    configurable: false,
                    enumerable: true,
                    get: function () {
                        $this.storeEvent.call($this, 'value', plain, key);
                        return plain[key];
                    },
                    set: !immutableState ? function (value) {
                        $this.storeEvent.call($this, 'global', plain, key, value);
                        $this.storeEvent.call($this, 'value', plain, key, value);
                        plain[key] = isKeyObject_1 ? _this.objectToStore(value, undefined, immutableState) : value;
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
                        $this.storeEvent.call($this, 'getter', plain, key);
                        return plain[key];
                    }
                });
            }
            else if (util_1.isSetter(descriptor)) {
                define({
                    configurable: false,
                    enumerable: false,
                    set: function (value) {
                        $this.storeEvent.call($this, 'global', plain, key, value);
                        $this.storeEvent.call($this, 'setter', plain, key, value);
                        plain[key] = value;
                    }
                });
            }
            else if (process.env.NODE_ENV !== 'production') {
                console.error('Descriptor of ' + key + ' is wrong');
            }
        };
        var this_1 = this;
        for (var key in plain) {
            _loop_1(key);
        }
        return obj;
    };
    Tuex.prototype.install = function (Vue) {
        if (this.vue && Vue === this.vue) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('[tuex] is already installed. Vue.use(new Tuex(...)) should be called only once.');
            }
            return;
        }
        this.vue = Vue;
        this.vue.prototype.$store = this.store;
    };
    return Tuex;
}());
exports.default = Tuex;

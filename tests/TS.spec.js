"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
test('Works as decorator', function () {
    var Vue = require('vue/dist/vue');
    var Tuex = require('../index.js').default;
    var Test = /** @class */ (function () {
        function Test() {
            this.test = 'ads';
        }
        Object.defineProperty(Test.prototype, "otherTest", {
            get: function () {
                return 'wow';
            },
            enumerable: true,
            configurable: true
        });
        Test.prototype.wow = function () {
            console.log('wow');
        };
        Test = __decorate([
            Tuex()
        ], Test);
        return Test;
    }());
    Vue.use(Test);
    var vm = new Vue();
    expect(vm.$store).toBeTruthy();
    expect(vm.$store.test).toBe('ads');
    expect(vm.$store.otherTest).toBe('wow');
    vm.$store.test = vm.$store.otherTest;
    expect(vm.$store.test).toBe('wow');
    expect(vm.$store.wow).toBeInstanceOf(Function);
    vm.$store.wow(2, 'asd');
});
test('Plugins work as intended', function () {
    var Vue = require('vue/dist/vue');
    var Tuex = require('../index.js').default;
    var plugins = [
        function (store) {
            console.log(store);
        }
    ];
    var Test = /** @class */ (function () {
        function Test() {
            this.test = 'ads';
        }
        Object.defineProperty(Test.prototype, "otherTest", {
            get: function () {
                return 'wow';
            },
            enumerable: true,
            configurable: true
        });
        Test.prototype.wow = function () {
            console.log('wow');
        };
        Test = __decorate([
            Tuex(plugins)
        ], Test);
        return Test;
    }());
    Vue.use(Test);
    var vm = new Vue();
    expect(vm.$store).toBeTruthy();
    expect(vm.$store.test).toBe('ads');
    expect(vm.$store.otherTest).toBe('wow');
    vm.$store.test = vm.$store.otherTest;
    expect(vm.$store.test).toBe('wow');
    expect(vm.$store.wow).toBeInstanceOf(Function);
    vm.$store.wow(2, 'asd');
});

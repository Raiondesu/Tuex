# Tuex

A simpler Vuex alternative written in TypeScript.

## [![Travis branch](https://img.shields.io/travis/Raiondesu/Tuex/master.svg?style=flat-square)](https://travis-ci.org/Raiondesu/Tuex) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/cjs/index.min.js?style=flat-square) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/cjs/index.min.js?style=flat-square&gzip=true) [![npm](https://img.shields.io/npm/dt/tuex.svg?style=flat-square)](http://npmjs.com/package/tuex)

## (TypeScript + Vuex) - Complexity = Tuex
Tuex is a centralized state management library for Vue.js.
It takes heavy inspiration from the Redux/Vuex pattern, but has some crucial differences.

The main goal of Tuex is to make state-management less complex for small-scale apps, while keeping the flexibility and scalability of Vuex. It proves useful for middle-scaled or growing apps, when the `global event bus` starts to feel restricting.

### ES versions
Tuex is written in typescript, but is also distributed for es5, es6 & esnext.

## Installation & Usage

```bash
npm i -S tuex
```

```js
// index.js/main.js/app.js (entry point)

import Vue from 'vue'
import Tuex from 'tuex'

Vue.use(Tuex);

const TuexStore = new Tuex.Store({
  num: 0,

  increment(amount) {
    this.num += amount;
  }
}, [
  function () {
    this.subscribe('value', function(store, key, value) {
      if (value)
        console.log(key + ' is being assigned a value of ' + value);
    });

    this.subscribe('action', function(store, key, ...args) {
      console.log(key + ' is called with args: `' + args + '`');
    });

    this.subscribe('action', function(store, key, amount) {
      if (key === 'increment')
        console.log('num will be incremented by ' + amount);
    });
  }
])
```

```js
// Vue component
...
methods: {
  someMethod() {
    this.$store.increment(10, 2);
    // => increment is called with args `[ 10, 2 ]`
    // => num will be incremented by 10
    // => num is being assigned a value of 10

    console.log(this.$store.num);
    // => 10

    this.$store.num = -1;

    console.log(this.$store.num);
    // => -1
  }
}
...
```

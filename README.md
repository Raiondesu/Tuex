# Tuex

A simpler Vuex alternative written in TypeScript.

## [![Travis branch](https://img.shields.io/travis/Raiondesu/Tuex/master.svg?style=flat-square)](https://travis-ci.org/Raiondesu/Tuex) [![Codacy branch grade](https://img.shields.io/codacy/grade/929a2e386c4c4cb6ae12619f89b0f0e3/master.svg?style=flat-square)]() ![size](https://badges.herokuapp.com/size/npm/tuex@latest/cjs/index.min.js?style=flat-square) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/cjs/index.min.js?style=flat-square&gzip=true) [![npm](https://img.shields.io/npm/dt/tuex.svg?style=flat-square)](http://npmjs.com/package/tuex)

## (TypeScript + Vuex) - Complexity = Tuex
Tuex is a centralized state management library for Vue.js.
It takes heavy inspiration from the Redux/Vuex pattern, but has some crucial differences.

The main goal of Tuex is to make state-management less complex for small-scale apps, while keeping the flexibility and scalability of Vuex. It proves useful for middle-scaled or growing apps, when the `global event bus` starts to feel restricting.

### ES versions
Tuex is written in typescript, but is also distributed for  commonjs es5, browser es5, es6 & esnext.

## Installation & Usage

### [CDN](https://unpkg.com/tuex)

```url
https://unpkg.com/tuex
```

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/tuex"></script>

<script>
  Vue.use(Tuex);

  var store = new Tuex.Store({
    foo: 'bar'
  });

  var vm = new Vue();

  console.log(vm.$store.foo);
  // => bar
</script>
```

### Node environment (webpack, browserify, etc.)

```bash
npm i -S tuex
```

```js
// App entry point

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
...
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

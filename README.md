# Tuex

A simpler Vuex alternative written in TypeScript.

## [![Travis branch](https://img.shields.io/travis/Raiondesu/Tuex/master.svg?style=flat-square)](https://travis-ci.org/Raiondesu/Tuex) [![Codacy branch grade](https://img.shields.io/codacy/grade/929a2e386c4c4cb6ae12619f89b0f0e3/master.svg?style=flat-square)]() ![size](https://badges.herokuapp.com/size/npm/tuex@latest/cjs/index.min.js?style=flat-square) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/cjs/index.min.js?style=flat-square&gzip=true) [![npm](https://img.shields.io/npm/dt/tuex.svg?style=flat-square)](http://npmjs.com/package/tuex)

## [Full Documentation](https://github.com/Raiondesu/Tuex/wiki)

## About
> (TypeScript + Vuex) - Complexity = Tuex

Tuex is a centralized state management library for Vue.js.
It takes heavy inspiration from the Redux/Vuex pattern, but has some crucial differences.

The main goal of Tuex is to make state-management less complex for small-scale apps, while keeping the flexibility and scalability of Vuex.
It proves useful mostly for middle-scaled or growing apps, when the `global event bus` starts to feel restricting.

### ES versions
Tuex is written in TypeScript, but is also distributed for  commonjs es5, browser es5, es6 & esnext.

## Installation & Usage

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

  increase(amount) {
    this.num += amount;
  }
});
...
```

```js
// Vue component
...
  created() {
    this.$store.increase(10, 2);
    console.log(this.$store.num);
    // => 10

    this.$store.num = -1;
    console.log(this.$store.num);
    // => -1
  }
...
```

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

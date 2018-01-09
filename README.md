# Tuex

A more precise Vuex alternative written in TypeScript.

## [![Travis branch](https://img.shields.io/travis/Raiondesu/Tuex/master.svg?style=flat-square)](https://travis-ci.org/Raiondesu/Tuex) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/dist/index.min.js?style=flat-square) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/dist/index.min.js?style=flat-square&gzip=true) [![David](https://img.shields.io/david/raiondesu/tuex.svg?style=flat-square)]() [![David](https://img.shields.io/david/dev/raiondesu/tuex.svg?style=flat-square)]() [![npm](https://img.shields.io/npm/dt/tuex.svg?style=flat-square)](http://npmjs.com/package/tuex)

## Install

```bash
npm i -S tuex
```

## Usage example

```js
// index.js/main.js/app.js (entry point)

import Vue from 'vue'
import Tuex from 'tuex'

const TuexStore = new Tuex({
  test: 'ads',

  get otherTest() {
    return 'wow';
  },

  set x(value) {
    this.test = value;
  },

  wow(amount, appendix) {
    var wows = '';
    for (let i = 0; i < amount; i++)
      wows += 'wow ';

    wows += appendix;
    console.log(wows);
  }
}, [ // Plugins here:
  function () {
    // typeof this === 'Tuex'
    this.subscribe('setter', function(store, key, value) {
      store[key] = 'ads';

      console.log(key + ' is being set with `' + value + '`');
    })
  }
])
```

```js
// Vue component
...
methods: {
  someMethod() {
    this.$store.wow(2, 'ads');
    // => wowwow ads
  }
}
...
```

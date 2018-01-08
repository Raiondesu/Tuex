# Tuex
A mostly reasonable replacement for Vuex

<!-- ## [![Travis branch](https://img.shields.io/travis/Raiondesu/tuex/master.svg?style=flat-square)](https://travis-ci.org/Raiondesu/tuex) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/dist/index.js?style=flat-square) ![size](https://badges.herokuapp.com/size/npm/tuex@latest/dist/index.js?style=flat-square&gzip=true) [![David](https://img.shields.io/david/raiondesu/tuex.svg?style=flat-square)]() [![David](https://img.shields.io/david/dev/raiondesu/tuex.svg?style=flat-square)]() [![npm](https://img.shields.io/npm/dt/tuex.svg?style=flat-square)](http://npmjs.com/package/tuex) -->

`npm i -S tuex`


```js
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
      var wows = [];
      for (let i = 0; i < amount; i++)
        wows.push('wow');

			console.log(wows, appendix);
		}
	}, [
    function () {
      this.subscribe('setter', function(store, key, value) {
        store[key] = 'ads';
        expect(vm.$store.test).toBe('ads');

        console.log(key + ' is being set with `' + value + '`');
      })
    }
  ])

```

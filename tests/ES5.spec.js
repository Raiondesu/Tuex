test('Works as class', () => {
	var Vue = require('vue/dist/vue');
	var Tuex = require('../cjs');

	var Test = new Tuex(class {
    constructor() {
		  this.test = 'ads';
    }

		get otherTest() {
			return 'wow';
    }

    set x(value) {
      this.test = value;
    }

		wow(amount, appendix) {
      expect(amount).toBe(2);
      expect(appendix).toBe('asd');

      var wows = '';

      for (let i = 0; i < amount; i++)
        wows += 'wow ';

      wows += appendix;

			console.log(wows);
		}
	}, {
    plugins: [
      function () {
        this.subscribe('setter', function(store, key, value) {
          expect(key).toBe('x');
          store[key] = 'ads';
          expect(vm.$store.test).toBe('ads');

          console.log(key + ' is being set with `' + value + '`');
        })
      }
    ]
  });

  Vue.use(Test);

	var vm = new Vue();

	expect(vm.$store).toBeTruthy();
	expect(vm.$store.test).toBe('ads');
	expect(vm.$store.otherTest).toBe('wow');

	vm.$store.test = vm.$store.otherTest;
	expect(vm.$store.test).toBe('wow');

	expect(vm.$store.wow).toBeInstanceOf(Function);
  vm.$store.wow(2, 'asd');

  vm.$store.x = 'new value of test';
  expect(vm.$store.test).toBe('new value of test');
})

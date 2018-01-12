describe('Tuex', () => {
  test('is constructed from class', () => {
    var Vue = require('vue/dist/vue');
    var Tuex = require('../cjs');

    Vue.use(Tuex);

    var Test = new Tuex.Store(class {
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
        var wows = '';

        for (let i = 0; i < amount; i++)
          wows += 'wow ';

        wows += appendix;

        return wows;
      }
    }, {
      plugins: [
        function () {
          this.subscribe('setter', function(state, key, value) {
            expect(key).toBe('x');
            state.x = 'ads';
            expect(state.test).toBe('ads');
          })
        }
      ]
    });

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
  });

  test('is replacing store', () => {
    var Vue = require('vue/dist/vue');
    var Tuex = require('../cjs');

    Vue.use(Tuex);

    var Test = new Tuex.Store(class {
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
        var wows = '';

        for (let i = 0; i < amount; i++)
          wows += 'wow ';

        wows += appendix;

        return wows;
      }
    }, {
      plugins: [
        function () {
          this.subscribe('setter', (state, key, value) => {
            this.replaceStore({
              x: 'some value',
              get y() {
                return this.x + ' of y';
              }
            });
          })
        }
      ]
    });

    var vm = new Vue();

    vm.$store.x = 'nah';

    expect(vm.$store.x).toBe('some value');
    expect(vm.$store.y).toBe(vm.$store.x + ' of y');
  });

  test('internall interactions are resolved correclty', () => {
    var Vue = require('vue/dist/vue');
    var Tuex = require('../cjs');

    Vue.use(Tuex);

    var Test = new Tuex.Store(class {
      constructor() {
        this.value = 0;
      }

      get Value() {
        return this.value;
      }

      set Value(value) {
        this.value = value;
      }

      increment(amount) {
        this.Value += amount;
      }
    }, {
      plugins: [
        function () {
          this.subscribe('action', (state, key, amount, arg1, arg2, arg3, arg4) => {
            expect(key).toBe('increment');
            expect(amount).toBe(2);
            expect(arg1).toBe(4);
            expect(arg2).toBe(6);
            expect(arg3).toBe(8);
            expect(arg4).toBe(undefined);
            console.log('Called method ' + key);
          });
          this.subscribe('value', (state, key, value) => {
            // if (value && key === 'value') {
            //   expect(value).toBe(2);
            // } else if (value && key === 'Value') {
            //   expect(value).toBe(-1);
            // }
            console.log('Accessed variable ' + key + (!!value ? ', assigning ' + value : ''));
          });
        }
      ]
    });

    var vm = new Vue();

    expect(vm.$store.value).toBe(0);
    expect(vm.$store.Value).toBe(vm.$store.value);

    // Additional arguments for args-passing checks
    vm.$store.increment(2, 4, 6, 8);
    expect(vm.$store.Value).toBe(2);

    vm.$store.Value = -1;
  });
})

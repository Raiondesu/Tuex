describe('Tuex works with', function (){
  test('construction from class', () => {
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

        console.log(wows);
      }
    }, {
      plugins: [
        function () {
          this.subscribe('setter', function(state, key, value) {
            expect(key).toBe('x');
            state[key] = 'ads';
            expect(vm.$store.test).toBe('ads');

            console.log(key + ' is being set with `' + value + '`');
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

  test('replacing store', () => {
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

        console.log(wows);
      }
    }, {
      plugins: [
        function () {
          this.store = 'asd'
          this.subscribe('setter', (state, key, value) => {
            console.log(this);
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
})

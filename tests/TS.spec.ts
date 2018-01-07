import {} from 'jest';
import {} from 'node';

test('Works as decorator', () => {
	var Vue = require('vue/dist/vue');
	var Tuex = require('../index.js').default;

	@Tuex()
	class Test {
		test: string = 'ads'

		get otherTest() {
			return 'wow';
		}

		wow() {
			console.log('wow');
		}
	}

	Vue.use(Test);

	var vm = new Vue();

	expect(vm.$store).toBeTruthy();
	expect(vm.$store.test).toBe('ads');
	expect(vm.$store.otherTest).toBe('wow');
	
	vm.$store.test = vm.$store.otherTest;

	expect(vm.$store.test).toBe('wow');

	expect(vm.$store.wow).toBeInstanceOf(Function);

	vm.$store.wow(2, 'asd');
})

test('Plugins work as intended', () => {
	var Vue = require('vue/dist/vue');
	var Tuex = require('../index.js').default;

	var plugins = [
		(store: Test) => {
			console.log(store);
		}
	];

	@Tuex(plugins)
	class Test {
		test: string = 'ads'

		get otherTest() {
			return 'wow';
		}

		wow() {
			console.log('wow');
		}
	}

	Vue.use(Test);

	var vm = new Vue();

	expect(vm.$store).toBeTruthy();
	expect(vm.$store.test).toBe('ads');
	expect(vm.$store.otherTest).toBe('wow');
	
	vm.$store.test = vm.$store.otherTest;

	expect(vm.$store.test).toBe('wow');

	expect(vm.$store.wow).toBeInstanceOf(Function);

	vm.$store.wow(2, 'asd');
})
test('Works as es5 funciton', () => {
	var Vue = require('vue/dist/vue');
	var Tuex = require('../index.js');

	var Test = Tuex()({
		test: 'ads',

		get otherTest() {
			return 'wow';
		},

		wow() {
			console.log('wow');
		}
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
})
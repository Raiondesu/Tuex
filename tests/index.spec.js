test('ads', () => {
	var Vue = require('vue/dist/vue');
	var Tuex = require('../index.js').default;

	const Test = {
		test: 'ads',

		get otherTest() {
			return 'wow';
		},

		wow: function() {
			console.log('wow');
		}
	}

	var tuex = Tuex()(Test);

	Vue.use(tuex);

	var vm = new Vue();

	expect(vm.$state).toBeTruthy();
	expect(vm.$state.test).toBe('ads');
	expect(vm.$state.otherTest).toBe('wow');
	
	vm.$state.test = vm.$state.otherTest;

	expect(vm.$state.test).toBe('wow');

	expect(vm.$state.wow).toBeInstanceOf(Function);

	vm.$state.wow(2, 'asd');
})
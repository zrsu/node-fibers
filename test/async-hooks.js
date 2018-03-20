'use strict';
// This test must be run with --force-async-hooks-checks
if (process.versions.modules < 57) {
	console.log('pass');
	return;
}
const { AsyncResource } = require('async_hooks');
const Fiber = require('fibers');

class TestResource extends AsyncResource {
	constructor() {
		super('TestResource');
	}

	run(cb) {
		this.emitBefore();
		cb();
		this.emitAfter();
	}
}

let tmp = Fiber(function() {
	let resource = new TestResource;
	resource.run(function() {
		Fiber.yield();
	});
});
tmp.run();
setTimeout(function() {
	tmp.run();
	console.log('pass');
}, 5);

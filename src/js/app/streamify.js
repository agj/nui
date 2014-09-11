
define( function(require) {
	'use strict';

	var bacon = require('Bacon');

	var overload = require('agj/function/overload');
	var seq = require('agj/function/sequence');
	var is = require('agj/is');
	var to = require('agj/to');

	function fromSignal(signal) {
		return Bacon.fromBinder( function (sink) {
			signal.add(listener);
			function listener(value) {
				sink(value);
			}
			return function () {
				signal.remove(listener);
			};
		});
	}

	function fromPromise(promise) {
		return bacon.fromFromise(promise);
	}

	function fromEvent(target, type) {
		return bacon.fromEventTarget(target, type);
	}

	var isSignal = seq(to.prop('add'), is.fn);
	var isPromise = seq(to.prop('then'), is.fn);

	var streamify = overload(
		[[isSignal], fromSignal],
		[[isPromise], fromPromise],
		[[is.set, is.string], fromEvent]
	);

	return streamify;

});

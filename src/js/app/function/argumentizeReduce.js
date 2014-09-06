
define( function (require) {
	'use strict';

	function argumentizeReduce(fn) {
		return function (accumulated, next) {
			return fn.apply(this, [accumulated].concat(next));
		};
	}

	return argumentizeReduce;

});


define( function(require) {
	'use strict';

	function argumentize(fn) {
		return function (arr) {
			return fn.apply(this, arr);
		};
	}

	return argumentize;

});

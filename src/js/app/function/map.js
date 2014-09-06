
define( function(require) {
	'use strict';

	function map(fn) {
		return function (arr) {
			return arr.map(fn);
		};
	}

	return map;

});

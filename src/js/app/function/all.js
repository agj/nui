
define( function(require) {
	'use strict';

	var toArray = require('agj/utils/toArray');

	function all() {
		var fns = toArray(arguments);
		return function () {
			var args = toArray(arguments);
			return fns.every( function (fn) {
				return fn.apply(this, args);
			});
		};
	}

	return all;

});

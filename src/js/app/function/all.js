
define( function(require) {
	'use strict';

	var toArray = require('agj/utils/toArray');

	function all() {
		var predicates = toArray(arguments);
		return function () {
			var args = toArray(arguments);
			return predicates.every( function (predicate) {
				return predicate.apply(this, args);
			});
		};
	}

	return all;

});

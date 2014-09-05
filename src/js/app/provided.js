
define( function(require) {
	'use strict';

	var toArray = require('agj/utils/toArray');

	function provided(predicate, action, otherwise) {
		return function () {
			var args = toArray(arguments);
			return predicate.apply(this, args) ? action.apply(this, args) : otherwise.apply(this, args);
		};
	}

	return provided;

});

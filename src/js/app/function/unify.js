
define( function(require) {
	'use strict';

	var toArray = require('agj/utils/toArray');

	function unify() {
		return toArray(arguments);
	}

	return unify;

});

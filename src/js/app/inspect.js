
define( function(require) {
	'use strict';

	var toArray = require('agj/utils/toArray');
	var log = require('agj/utils/log');

	function inspect(arg) {
		log.apply(null, toArray(arguments));
		return arg;
	}

	return inspect;

});


define( function(require) {
	'use strict';

	var toArray = require('agj/utils/toArray');
	var autoCurry = require('agj/function/autoCurry');

	var bind = autoCurry(function (fn, target) {
		return fn.bind(target);
	});

	return bind;

});

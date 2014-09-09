
define( function(require) {
	'use strict';

	var memoize = require('agj/function/memoize');
	var λ = require('lambda');

	return memoize(λ);

});

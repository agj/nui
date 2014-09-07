
define( function(require) {
	'use strict';

	var overload = require('agj/function/overload');
	var autoCurry = require('agj/function/autoCurry');
	var is = require('agj/is');

	function getRadians(x, y) {
		return Math.atan2(y, x);
	}

	var radians = overload(
		[[is.number, overload.REST], autoCurry(getRadians)],
		function (pt) {
			return radians(pt.x, pt.y);
		}
	);

	return radians;

});

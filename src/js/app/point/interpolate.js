
define( function(require) {
	'use strict';

	var autoCurry = require('agj/function/autoCurry');

	var interpolate = autoCurry(function (position, point1, point2) {
		var x = point2.x - point1.x;
		var y = point2.y - point1.y;
		return {
			x: x * position + point1.x,
			y: y * position + point1.y
		};
	});

	return interpolate;

});

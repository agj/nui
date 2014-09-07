
define( function(require) {
	'use strict';

	var autoCurry = require('agj/function/autoCurry');

	var subtract = autoCurry(function (pa, pb) {
		return {
			x: pa.x - pb.x,
			y: pa.y - pb.y,
		};
	});

	return subtract;

});


define( function(require) {
	'use strict';

	var autoCurry = require('agj/function/autoCurry');

	var distance = autoCurry( function (pa, pb) {
		var x = pa.x - pb.x;
		var y = pa.y - pb.y;
		return Math.sqrt(x * x + y * y);
	});

	return distance;

});

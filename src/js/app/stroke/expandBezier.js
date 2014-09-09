
define( function (require) {
	'use strict';

	var lazy = require('lazy');
	var λ = require('app/lambda');

	var first = require('agj/array/first');
	var last = require('agj/array/last');
	var autoCurry = require('agj/function/autoCurry');

	var argumentize = require('app/function/argumentize');
	var interpolate = require('app/point/interpolate');

	var expandBezier = autoCurry(function (totalPoints, coords) {
		return [first(coords)]
			.concat(
				lazy.range(totalPoints)
				.map(λ('(a + 1) /' + (totalPoints + 1)))
				.map(bezierPointAt(coords))
				.toArray()
			).concat([last(coords)]);
	});

	var bezierPointAt = autoCurry(function (coords, pos) {
		if (coords.length === 2) return interpolate(pos, coords[0], coords[1]);
		return bezierPointAt(
			lazy(coords)
				.consecutive(2)
				.map(argumentize(interpolate(pos)))
				.toArray(),
			pos
		);
	});

	return expandBezier;

});

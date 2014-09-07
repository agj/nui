
define( function (require) {
	'use strict';

	var lazy = require('lazy');

	var first = require('agj/array/first');
	var last  = require('agj/array/last');

	var argumentizeReduce = require('app/function/argumentizeReduce');
	var radians           = require('app/point/radians');
	var radianDiff        = require('app/point/radianDifference');
	var diffPoints        = require('app/point/subtract');

	var tau = Math.PI * 2;

	function removeRedundantPoints(points) {
		return lazy(last(-1, points))
			.consecutive(2)
			.reduce( argumentizeReduce(function (r, point, next) {
				var prev = last(r);
				if (inflects(prev, point, next))
					return r.concat([point]);
				return r;
			}), [first(points)])
			.concat([last(points)]);
	}

	function inflects(prev, point, next) {
		return 1 / 8 <
			radianDiff(
				radians(diffPoints(prev, point)),
				radians(diffPoints(point, next))
			) / tau;
	}

	return removeRedundantPoints;

});

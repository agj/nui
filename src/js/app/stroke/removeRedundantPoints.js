
define( function (require) {
	'use strict';

	var lazy = require('lazy');

	var first = require('agj/array/first');
	var last  = require('agj/array/last');
	var log   = require('agj/utils/log');
	var to    = require('agj/to');

	var cfg               = require('app/configuration');
	var argumentizeReduce = require('app/function/argumentizeReduce');
	var radians           = require('app/point/radians');
	var radianDiff        = require('app/point/radianDifference');
	var diffPoints        = require('app/point/subtract');
	var distance          = require('app/point/distance');
	var SPY               = require('app/inspect');

	var tau = Math.PI * 2;
	var xSPY = to.id;

	function removeRedundantPoints(points) {
		var lastPoint = last(points);
		return lazy(last(-1, points))
			.consecutive(2)
			.reduce( argumentizeReduce(function (r, point, next) {
				var prev = last(r);
				if (inflects(prev, point, next, lastPoint))
					return r.concat([point]);
				return r;
			}), [first(points)])
			.concat([lastPoint]);
	}

	function inflects(prev, point, next, lastPoint) {
		var angle = radianDiff(
				radians(diffPoints(prev, point)),
				radians(diffPoints(point, next))
			) / tau;
		var dist = distance(prev, point) / cfg.SVG_SIZE;
		var distToEnd = distance(point, lastPoint) / cfg.SVG_SIZE;

		// log(angle, 'angle');
		// log(dist, 'dist');
		// log(distToEnd, 'distToEnd');

		if (distToEnd < 1 / 32) return xSPY(false);
		if (dist < 1 / 16 || distToEnd < 1 / 16) return xSPY(angle > 1 / 4);
		if (dist < 1 / 8  || distToEnd < 1 / 8 ) return xSPY(angle > 1 / 8);
		if (dist < 1 / 4  || distToEnd < 1 / 4 ) return xSPY(angle > 1 / 24);
		return xSPY(angle > 1 / 32);
	}

	return removeRedundantPoints;

});

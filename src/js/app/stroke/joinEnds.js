
define( function (require) {
	'use strict';

	var lazy = require('lazy');

	var findIndex = require('agj/array/findIndex');
	var within    = require('agj/array/within');
	var first     = require('agj/array/first');
	var last      = require('agj/array/last');
	var provided  = require('app/function/provided');
	var not       = require('agj/function/not');
	var seq       = require('agj/function/sequence');
	var fixArity  = require('agj/function/fixArity');
	var is        = require('agj/is');
	var to        = require('agj/to');

	var argumentizeReduce = require('app/function/argumentizeReduce');
	var distance          = require('app/point/distance');

	var fix = fixArity(1);

	function joinEnds(strokes) {
		var refPoints = strokes.map(fix(first)).concat(strokes.map(fix(last)));
		return strokes.map( function (points) {
			var isFirstOrLast = within([first(points), last(points)]);
			return lazy(points)
				.map( provided( not(isFirstOrLast), to.id,
					function (point) {
						var ptIndex = findIndex(refPoints, seq(distance(point), is.lt(15)));
						if (ptIndex === -1) {
							// refPoints.push(point);
							return point;
						} else {
							return refPoints[ptIndex];
						}
					}
				))
				.toArray();
		});
	}

	return joinEnds;

});

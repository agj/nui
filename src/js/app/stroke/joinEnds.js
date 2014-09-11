
define( function (require) {
	'use strict';

	var λ    = require('app/lambda');
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

	var cfg               = require('app/configuration');
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
						var ptIndex = findIndex(refPoints, seq(distance(point), λ('/' + cfg.SVG_SIZE), is.lt(1 / 20)));
						if (ptIndex === -1) {
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


define( function(require) {
	'use strict';

	var $    = require('jquery');
	var lazy = require('lazy');
	var λ    = require('lambda');

	var log       = require('agj/utils/log');
	var draw      = require('agj/graphics/draw');
	var DrawStyle = require('agj/graphics/DrawStyle');
	var merge     = require('agj/object/merge');
	var mapObj    = require('agj/object/map');
	var first     = require('agj/array/first');
	var last      = require('agj/array/last');
	var findIndex = require('agj/array/findIndex');
	var clone     = require('agj/array/clone');
	var within    = require('agj/array/within');
	var flatten   = require('agj/array/flatten');
	var partial   = require('agj/function/partial');
	var autoCurry = require('agj/function/autoCurry');
	var seq       = require('agj/function/sequence');
	var not       = require('agj/function/not');
	var fixArity  = require('agj/function/fixArity');
	var returnArg = require('agj/function/returnArg');
	var is        = require('agj/is');
	var to        = require('agj/to');

	var config            = require('app/config');
	var drawA             = require('app/drawA');
	var SPY               = require('app/inspect');
	var argumentize       = require('app/function/argumentize');
	var argumentizeReduce = require('app/function/argumentizeReduce');
	var provided          = require('app/function/provided');
	var unify             = require('app/function/unify');
	var map               = require('app/function/map');
	var bind              = require('app/function/bind');
	var offsetPoint       = require('app/point/add');
	var diffPoints        = require('app/point/subtract');
	var distance          = require('app/point/distance');
	var interpolate       = require('app/point/interpolate');
	var normalizePoint    = require('app/point/normalizePoint');
	var radians           = require('app/point/radians');
	var radianDiff        = require('app/point/radianDifference');
	var absolutizeStrokes = require('app/stroke/absolutizeStrokes');
	var strokeToBeziers   = require('app/stroke/strokeToBeziers');
	var expandBezier      = require('app/stroke/expandBezier');
	var removeEdgePoints  = require('app/stroke/removeEdgePoints');

	var fix = fixArity(1);
	var tau = Math.PI * 2;
	var xSPY = to.id;

	var doDraw = autoCurry( function (canvas, strokes) {
		var ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var drawHole = drawA.hole(ctx);
		var drawPin = drawA.pin(ctx);

		var bezierStrokes = strokes
			.map(absolutizeStrokes())
			.map(strokeToBeziers);

		bezierStrokes.forEach(
			to.call('forEach', [seq(
				map(normalizePoint({ x: canvas.width, y: canvas.width })),
				drawBezier(ctx)
			)])
		);

		joinEnds(
			bezierStrokes
			.map(map(expandBezier(5)))
			// .map(fix(SPY))
			.map(removeEdgePoints)
			.map(flatten)
			.map(removeRedundantPoints)
			.map(map(normalizePoint({ x: canvas.width, y: canvas.width })))
		)

		.forEach( function (points) {
			// lazy(points).consecutive(2).each( argumentize(function (a, b) {
			// 	draw.line(ctx, new DrawStyle().lineColor(0x000000).lineWeight(3).lineAlpha(0.3), a, b);
			// }));
			drawHole(first(points));
			drawHole(last(points));
			points.slice(1, -1).forEach(drawPin);
		});
	});

	function joinEnds(strokes) {
		var refPoints = strokes.map(fix(first));//.concat(strokes.map(fix(last)));
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
		// log('inflects', prev, point, next);
		var angle = radianDiff(
				radians(diffPoints(prev, point)),
				radians(diffPoints(point, next))
			) / tau;
		// var dist = distance(point, next) / 109;

		// log(dist, 'dist');
		// log(angle, 'angle');
		// log(radians(diffPoints(prev, point)), 'angle a');
		// log(radians(diffPoints(point, next)), 'angle b');

		return angle > 1 / 8;

		// if (dist < 1 / 64) return SPY(angle > 1 / 1);
		// if (dist < 1 / 32) return SPY(angle > 1 / 1);
		// if (dist < 1 / 16) return SPY(angle > 1 / 1);
		// if (dist < 1 / 8 ) return SPY(angle > 1 / 16);
		// if (dist < 1 / 4 ) return SPY(angle > 1 / 1);
		// // if (dist < 1 / 2  && angle < 1 / 8) return false;
		// // if (angle < 1 / 32) return false;
		// return SPY(true);

		// // return SPY( angle > 0.01 / dist, 'result inflects');
	}

	// function removeRedundancy(strokes) {
	// 	var refPoints = strokes.map(fix(first)).concat(strokes.map(fix(last)));

	// 	return strokes.map( function (points) {
	// 		var firstOrLast = within([first(points), last(points)]);
	// 		points = lazy(points)
	// 			.map( provided( not(firstOrLast), to.id,
	// 				function (point) {
	// 					var ptIndex = findIndex(refPoints, seq(distance(point), is.lt(15)));
	// 					if (ptIndex === -1) {
	// 						refPoints.push(point);
	// 						return point;
	// 					} else {
	// 						return refPoints[ptIndex];
	// 					}
	// 				}
	// 			))
	// 			.toArray();

	// 		if (points.length < 3) return points;
	// 		return lazy(points)
	// 			.consecutive(3)
	// 			.reduce( argumentizeReduce(function (r, before, point, after) {
	// 				if (config.DONT_REDUCE_POINTS || distance(point, before) >= 15) {
	// 					r = r.concat([point]);
	// 				}
	// 				return r;
	// 			}), [first(points)])
	// 			.concat([last(points)]);
	// 	});
	// }

	var drawBezier = autoCurry(function (ctx, points) {
		draw.curve.apply(null,
			[ctx, new DrawStyle().lineColor(0x000000).lineWeight(2).lineAlpha(0.2)]
			.concat(points)
		);
	});

	return doDraw;

});

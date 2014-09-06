
define( function(require) {
	'use strict';

	var $    = require('jquery');
	var lazy = require('lazy');
	var λ    = require('lambda-functional');

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

	var config      = require('app/config');
	var drawA       = require('app/drawA');
	var argumentize = require('app/argumentize');
	var provided    = require('app/provided');
	var unify       = require('app/unify');
	var inspect     = require('app/inspect');
	var map         = require('app/map');
	var bind        = require('app/bind');
	var offsetPoint = require('app/point/add');
	var distance    = require('app/point/distance');
	var interpolate = require('app/point/interpolate');

	var fix = fixArity(1);

	var doDraw = autoCurry( function (canvas, strokes) {
		var ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var drawHole = drawA.hole(ctx);
		var drawPin = drawA.pin(ctx);

		// removeRedundancy(
		// )
		var bezierStrokes = strokes
			.map(absolutizeStrokes())
			.map(strokeToBeziers);

		bezierStrokes.forEach(
			to.call('forEach', [seq(
				map(normalizePoint({ x: canvas.width, y: canvas.width })),
				drawBezier(ctx)
			)])
		);

		bezierStrokes
		.map(beziersToPoints)
		.map(map(normalizePoint({ x: canvas.width, y: canvas.width })))

		.forEach( function (points) {
			// lazy(points).consecutive(2).each( argumentize(function (a, b) {
			// 	draw.line(ctx, new DrawStyle().lineColor(0x000000).lineWeight(3).lineAlpha(0.3), a, b);
			// }));
			drawHole(first(points));
			drawHole(last(points));
			points.slice(1, -1).forEach(drawPin);
		});
	});

	function absolutizeStrokes() {
		var pos = { x: 0, y: 0 };
		return function (stroke) {
			return stroke.map( function (instr) {
				instr = merge({}, instr);
				if (!instr.absolute) {
					instr.coords = instr.coords.map(offsetPoint(pos));
				}
				instr.absolute = true;
				pos = last(instr.coords);
				return instr;
			});
		};
	}

	function strokeToBeziers(stroke) {
		return lazy(stroke)
			.consecutive(2)
			.reduce( argumentizeReduce(function (r, ia, ib) {
				if (ib.command === 'c') {
					return r.concat( [last(1, ia.coords).concat(ib.coords)] );
				}
				return r;
			}), [])
	}

	function beziersToPoints(stroke) {
		return flatten(
			stroke
			.map(bezierToPoints(1))
		);
	}

	var bezierToPoints = autoCurry(function (totalPoints, coords) {
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

	function normalizePoint(target) {
		target = mapObj(target, λ('/109'));
		return function (pt) {
			return { x: pt.x * target.x, y: pt.y * target.y };
		};
	}

	// function instructionToPoints(instr) {
	// 	if (instr.command === 'm') {
	// 		return instr.coords;
	// 	} else if (instr.command === 'c') {
	// 		return bezierToPoints(1, instr.coords);
	// 	} else {
	// 		throw new Error("Don't understand path instruction command: " + instr.command);
	// 	}
	// }

	// function normalize(target) {
	// 	target = mapObj(target, λ('/109'));
	// 	var normalizePoint = function (pt) {
	// 		return { x: pt.x * target.x, y: pt.y * target.y };
	// 	};
	// 	var pos = { x: 0, y: 0 };

	// 	return function (stroke) {
	// 		return stroke.map( function (inst) {
	// 			var pt;
	// 			if (inst.command === 'm') {
	// 				pt = inst.coords[0];
	// 				pos = inst.absolute ? pt : offsetPoint(pos, pt);
	// 				return pos;
	// 			} else if (inst.command === 'c') {
	// 				pt = inst.coords[2];
	// 				pos = inst.absolute ? pt : offsetPoint(pt, pos);
	// 				return pos;
	// 			}
	// 		}).map(normalizePoint);
	// 	};
	// }

	function removeRedundancy(strokes) {
		var refPoints = strokes.map(fix(first)).concat(strokes.map(fix(last)));

		return strokes.map( function (points) {
			var firstOrLast = within([first(points), last(points)]);
			points = lazy(points)
				.map( provided( not(firstOrLast), to.id,
					function (point) {
						var ptIndex = findIndex(refPoints, seq(distance(point), is.lt(15)));
						if (ptIndex === -1) {
							refPoints.push(point);
							return point;
						} else {
							return refPoints[ptIndex];
						}
					}
				))
				.toArray();

			if (points.length < 3) return points;
			return lazy(points)
				.consecutive(3)
				.reduce( argumentizeReduce(function (r, before, point, after) {
					if (config.DONT_REDUCE_POINTS || distance(point, before) >= 15) {
						r = r.concat([point]);
					}
					return r;
				}), [first(points)])
				.concat([last(points)]);
		});
	}

	function argumentizeReduce(fn) {
		return function (accumulated, next) {
			return fn.apply(this, [accumulated].concat(next));
		};
	}

	var drawBezier = autoCurry(function (ctx, points) {
		draw.curve.apply(null,
			[ctx, new DrawStyle().lineColor(0x000000).lineWeight(2).lineAlpha(0.2)]
			.concat(points)
		);
	});

	return doDraw;

});

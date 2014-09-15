
define( function(require) {
	'use strict';

	require('app/addPassTo')();

	var $            = require('jquery');
	var lazy         = require('lazy');
	var bacon        = require('Bacon');
	var λ            = require('app/lambda');
	var rsvp         = require('rsvp');
	var crossroads   = require('crossroads');
	var hasher       = require('hasher');

	var log       = require('agj/utils/log');
	var partial   = require('agj/function/partial');
	var passThis  = require('agj/function/passThis');
	var seq       = require('agj/function/sequence');
	var not       = require('agj/function/not');
	var autoCurry = require('agj/function/autoCurry');
	var hex       = require('agj/number/inBase')(16);
	var first     = require('agj/array/first');
	var last      = require('agj/array/last');
	var flatten   = require('agj/array/flatten');
	var within    = require('agj/array/within');
	var merge     = require('agj/object/merge');
	var to        = require('agj/to');
	var is        = require('agj/is');
	var on        = require('agj/utils/eventConstants');

	var promisify       = require('app/promisify');
	var streamify       = require('app/streamify');
	var doDraw          = require('app/draw/doDraw');
	var map             = require('app/function/map');
	var argumentize     = require('app/function/argumentize');
	var all             = require('app/function/all');
	var distance        = require('app/point/distance');
	var pointSubtract   = require('app/point/subtract');
	var radians         = require('app/point/radians');
	var normalizePoint  = require('app/point/normalizePoint');
	var svgToRawStrokes = require('app/stroke/svgToRawStrokes');
	var rawToBeziers    = require('app/stroke/rawToBeziers');
	var beziersToPoints = require('app/stroke/beziersToPoints');
	var SPY             = require('app/inspect');

	var tail = last(-1);
	var initial = first(-1);


	var kanjiRoute = crossroads.addRoute('/kanji/{kanji}');

	kanjiRoute.matched.add( function (kanji) {
		promisify($.get('./data/svg/' + hex(kanji.charCodeAt(0), 5) + '.svg'))
		.then( function (svg) {
			var canvas = $('#game')[0];
			var normalizePointCanvas = normalizePoint({ width: canvas.width, height: canvas.height, x: 0, y: 0 });

			var rawStrokes = svgToRawStrokes(svg);
			var bezierStrokes = rawToBeziers(rawStrokes);
			var pointStrokes = beziersToPoints(bezierStrokes);
			var yarn = [];
			var freeYarn = [];

			bezierStrokes = bezierStrokes
				.map(map(map(normalizePointCanvas)));
			pointStrokes = pointStrokes
				.map(map(normalizePointCanvas));
			var holes = pointStrokes
				.map( function (points) {
					return [first(points), last(points)];
				})
				.passTo(flatten);
			var pins = pointStrokes
				.map( function (points) {
					return points.slice(1, -1);
				})
				.passTo(flatten);

			doDraw(canvas, bezierStrokes, pointStrokes, yarn);

			var routeChanged = streamify(kanjiRoute.matched);
			var clickPoint = streamify(canvas, on.mouse.click)
				.map(eventToCoords(canvas))
				.takeUntil(routeChanged);
			var closestHole = clickPoint
				.map(getClosest(holes))
				.toProperty();
			var clickOnHole = clickPoint
				.zip(closestHole)
				.map(argumentize(distance))
				.filter(is.less(20))
				.map(closestHole);
			var cursorPoint = streamify(canvas, on.mouse.move)
				.map(eventToCoords(canvas))
				.takeUntil(routeChanged)
				.toProperty();

			cursorPoint
			.slidingWindow(2, 2)
			.onValue( argumentize(function (before, now) {
				var match;
				if (yarn.length) {
					var allPoints = flatten(yarn).concat(freeYarn);
					var lastPoint = last(allPoints);
					match = pins
						.filter(all(
							not(is.equal(lastPoint)),
							inTriangle(before, now, lastPoint)
						))
						[0];
					if (match) {
						freeYarn.push(merge(match, {
							angle: radians(pointSubtract(match, lastPoint)),
							turn: bend([lastPoint, match, now]),
						}));
					}
				}
				// if (!match && yarn.length) {
				// 	while (freeYarn.length >= 1) {
				// 		var start = [last(last(yarn))].concat(freeYarn).passTo(last(2));
				// 		if (bendsRight(start.concat(before)) !== bendsRight(start.concat(now))) {
				// 			freeYarn = initial(freeYarn);
				// 		} else {
				// 			break;
				// 		}
				// 	}
				// }
				doDraw(canvas, bezierStrokes, pointStrokes, yarn.concat([freeYarn.concat(now)]));
			}));

			clickOnHole
			.zip(cursorPoint.sampledBy(clickOnHole))
			.doAction(log)
			.onValue( argumentize(function (hole, cursor) {
				if (!yarn.length || last(last(yarn)) !== hole) {
					if (!yarn.length) yarn.push([]);
					if (last(yarn).length <= 1) last(yarn).push(hole);
					else yarn.push([hole]);
				} else if (yarn.length && last(last(yarn)) === hole) {
					yarn[yarn.length - 1] = last(yarn).passTo(first(-1));
					yarn = yarn.filter(not(is.empty));
				}
				doDraw(canvas, bezierStrokes, pointStrokes, yarn.concat([[cursor]]));
				// freeYarn = yarn.length ? [last(last(yarn))] : [];
				freeYarn = [];
			}));

			streamify(canvas, on.mouse.leave)
			.takeUntil(routeChanged)
			.onValue( function () {
				doDraw(canvas, bezierStrokes, pointStrokes, yarn);
				freeYarn = [];
			});
		});
	});


	hasher.initialized.addOnce(parseHash);
	hasher.changed.add( function (newHash, oldHash) {
		crossroads.parse(newHash);
	});

	rsvp.on('error', raise);

	promisify($(document).ready)
	.then(hasher.init);



	/////

	function raise(err) {
		console.assert(false, err);
	}

	var eventToCoords = function (el) {
		var pos = $(el).position();
		return function (e) {
			return {
				x: e.pageX - pos.left,
				y: e.pageY - pos.top,
			};
		};
	};

	var getClosest = autoCurry(function (points, ref) {
		return points.reduce( function (a, b) {
			return distance(ref, a) > distance(ref, b) ? b : a;
		});
	});

	function setLastInYarn(yarn, point) {
		if (!yarn.length) yarn.push([]);
		if (!last(yarn).length) last(yarn).push(point);
		else last(yarn)[last(yarn).length - 1] = point;
	}

	var inTriangle = autoCurry(function (ta, tb, tc, p) {
		var A = 1/2 * (-tb.y * tc.x + ta.y * (-tb.x + tc.x) + ta.x * (tb.y - tc.y) + tb.x * tc.y);
		var sign = A < 0 ? -1 : 1;
		var s = (ta.y * tc.x - ta.x * tc.y + (tc.y - ta.y) * p.x + (ta.x - tc.x) * p.y) * sign;
		var t = (ta.x * tb.y - ta.y * tb.x + (ta.y - tb.y) * p.x + (tb.x - ta.x) * p.y) * sign;
		
		return s > 0 && t > 0 && (s + t) < 2 * A * sign;
	});

	function bendsRight(points) {
		return bend(points) >= 0;
	}

	function bend(points) {
		return pointSubtract(
				radians(pointSubtract(points[2], points[1])),
				radians(pointSubtract(points[1], points[2]))
			);
	}

	var tau = Math.PI * 2;

	function radianDifference(ra, rb) {
		var diff = ra > rb ? ra - rb : rb - ra;
		while (diff > Math.PI) diff = Math.abs(diff - tau);
		return diff;
	}

});

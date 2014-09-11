
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
	var to        = require('agj/to');
	var is        = require('agj/is');
	var on        = require('agj/utils/eventConstants');

	var promisify       = require('app/promisify');
	var streamify       = require('app/streamify');
	var doDraw          = require('app/draw/doDraw');
	var map             = require('app/function/map');
	var argumentize     = require('app/function/argumentize');
	var distance        = require('app/point/distance');
	var normalizePoint  = require('app/point/normalizePoint');
	var svgToRawStrokes = require('app/stroke/svgToRawStrokes');
	var rawToBeziers    = require('app/stroke/rawToBeziers');
	var beziersToPoints = require('app/stroke/beziersToPoints');
	var SPY             = require('app/inspect');


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


			var clickPoint = streamify(canvas, on.mouse.click)
			.map(eventToCoords(canvas));

			var closestHole = clickPoint
			.map(getClosest(holes))
			.toProperty();

			clickPoint
			.zip(closestHole)
			.map(argumentize(distance))
			.filter(is.less(20))
			.map(closestHole)
			.takeUntil(streamify(kanjiRoute.matched))
			.doAction(log)
			.onValue( function (hole) {
				if (!yarn.length || last(last(yarn)) !== hole) {
					if (!yarn.length) yarn.push([]);
					if (last(yarn).length <= 1) last(yarn).push(hole);
					else yarn.push([hole]);
				} else if (yarn.length && last(last(yarn)) === hole) {
					yarn[yarn.length - 1] = last(yarn).passTo(first(-1));
					yarn = yarn.filter(not(is.empty));
				}
				doDraw(canvas, bezierStrokes, pointStrokes, yarn);
			});

			// event($('#game'), on.mouse.move)
			// .map(eventToCoords(canvas))
			// .onValue(log);
		});
	});


	hasher.initialized.addOnce(parseHash);
	hasher.changed.add(parseHash);

	rsvp.on('error', raise);

	promisify($(document).ready)
	.then(hasher.init);



	/////

	function raise(err) {
		console.assert(false, err);
	}

	function parseHash(newHash, oldHash) {
		crossroads.parse(newHash);
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

});

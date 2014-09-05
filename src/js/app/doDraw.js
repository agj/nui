
define( function(require) {
	'use strict';

	var $ = require('jquery');
	var lazy = require('lazy');
	var λ = require('lambda-functional');

	var log = require('agj/utils/log');
	var draw = require('agj/graphics/draw');
	var DrawStyle = require('agj/graphics/DrawStyle');
	var merge = require('agj/object/merge');
	var mapObj = require('agj/object/map');
	var first = require('agj/array/first');
	var last = require('agj/array/last');
	var findIndex = require('agj/array/findIndex');
	var clone = require('agj/array/clone');
	var within = require('agj/array/within');
	var partial = require('agj/function/partial');
	var autoCurry = require('agj/function/autoCurry');
	var seq = require('agj/function/sequence');
	var not = require('agj/function/not');
	var is = require('agj/is');
	var to = require('agj/to');

	var drawA = require('app/drawA');
	var argumentize = require('app/argumentize');
	var provided = require('app/provided');
	var offsetPoint = require('app/point/add');
	var distance = require('app/point/distance');

	var doDraw = autoCurry( function (canvas, strokes) {
		var ctx = canvas.getContext('2d');

		var drawHole = drawA.hole(ctx);
		var drawPin = drawA.pin(ctx);

		strokes
		.map(normalize({ x: canvas.width, y: canvas.width }))
		.map(removeRedundancy())

		.forEach( function (stroke) {
			lazy(stroke).consecutive(2).each( argumentize( function (a, b) {
				draw.line(ctx, new DrawStyle().lineColor(0x000000).lineWeight(3).lineAlpha(0.3), a, b);
			}));
			drawHole(first(stroke));
			drawHole(last(stroke));
			stroke.slice(1, -1).forEach(drawPin);
		});
	});

	function normalize(target) {
		target = mapObj(target, λ('/109'));
		var normalizePoint = function (pt) {
			return { x: pt.x * target.x, y: pt.y * target.y };
		};
		var pos = { x: 0, y: 0 };

		return function (stroke) {
			return stroke.map( function (inst) {
				var pt;
				if (inst.command === 'm') {
					pt = inst.coords[0];
					pos = inst.absolute ? pt : offsetPoint(pos, pt);
					return pos;
				} else if (inst.command === 'c') {
					pt = inst.coords[2];
					pos = inst.absolute ? pt : offsetPoint(pt, pos);
					return pos;
				}
			}).map(normalizePoint);
		};
	}

	function removeRedundancy() {
		var points = [];
		return function (stroke) {
			var firstOrLast = within([first(stroke), last(stroke)]);
			return stroke.map( provided( not(firstOrLast), to.id,
				function (point) {
					var ptIndex = findIndex(points, seq(distance(point), is.lt(15)));
					if (ptIndex === -1) {
						points.push(point);
						return point;
					} else {
						return points[ptIndex];
					}
				}
			));
		};
	}

	return doDraw;

});

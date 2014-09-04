
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
	var partial = require('agj/function/partial');


	function doDraw(strokes) {
		var canvas = $('#game')[0];
		var ctx = canvas.getContext('2d');

		var normal = { x: canvas.width / 109, y: canvas.width / 109 };
		var normalize = function (pt) {
			return { x: pt.x * normal.x, y: pt.y * normal.y };
		};

		var drawHole = partial(drawHole_, [ctx]);
		var drawPin = partial(drawPin_, [ctx]);

		var pos = { x: 0, y: 0 };

		strokes.map( function (stroke) {
			return lazy(stroke).map( function (inst) {
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
			}).map(normalize).toArray();
		})

		.forEach( function (stroke) {
			lazy(stroke).consecutive(2).each( argumentize(function (a, b) {
				draw.line(ctx, new DrawStyle().lineColor(0xff0000).lineWeight(3).lineAlpha(1), a, b);
			}));
			drawHole(first(stroke));
			drawHole(last(stroke));
			stroke.slice(1, -1).forEach(drawPin);
		});
	}

	function offsetPoint(pa, pb) {
		return {
			x: pa.x + pb.x,
			y: pa.y + pb.y,
		};
	}

	function argumentize(fn) {
		return function (arr) {
			return fn.apply(this, arr);
		};
	}

	var holeStyle = new DrawStyle().lineColor(0xff0000).lineWeight(3).lineAlpha(1);
	var pinStyle = new DrawStyle().fillColor(0x0000ff).fillAlpha(1);

	function drawHole_(ctx, point) {
		draw.circle(ctx, holeStyle, merge(point, { radius: 5 } ));
	}
	function drawPin_(ctx, point) {
		draw.circle(ctx, pinStyle, merge(point, { radius: 3 } ));
	}

	return doDraw;

});

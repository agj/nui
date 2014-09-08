
define( function(require) {
	'use strict';

	var log = require('agj/utils/log');
	var draw = require('agj/graphics/draw');
	var DrawStyle = require('agj/graphics/DrawStyle');
	var merge = require('agj/object/merge');
	var autoCurry = require('agj/function/autoCurry');


	var holeStyle = new DrawStyle().lineColor(0xdd0033).lineWeight(3).lineAlpha(0.5);
	var pinStyle = new DrawStyle().lineColor(0xdd0033).lineWeight(3).lineAlpha(0.5);

	var drawHole = autoCurry( function (ctx, point) {
		draw.circle(ctx, holeStyle, merge(point, { radius: 5 } ));
	});

	var drawPin = autoCurry( function (ctx, pt) {
		draw.line(ctx, pinStyle, { x: pt.x - 7, y: pt.y }, { x: pt.x + 7, y: pt.y });
		draw.line(ctx, pinStyle, { x: pt.x, y: pt.y - 7 }, { x: pt.x, y: pt.y + 7 });
	});

	return {
		hole: drawHole,
		pin: drawPin,
	};

});

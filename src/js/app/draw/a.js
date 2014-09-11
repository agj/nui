
define( function(require) {
	'use strict';

	var log = require('agj/utils/log');
	var draw = require('agj/graphics/draw');
	var DrawStyle = require('agj/graphics/DrawStyle');
	var merge = require('agj/object/merge');
	var autoCurry = require('agj/function/autoCurry');

	var color = 0x000000;
	var holeStyle = new DrawStyle().lineColor(color).lineWeight(3).lineAlpha(1);
	var pinStyle = new DrawStyle().lineColor(color).lineWeight(3).lineAlpha(1);

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

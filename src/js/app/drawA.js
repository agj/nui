
define( function(require) {
	'use strict';

	var log = require('agj/utils/log');
	var draw = require('agj/graphics/draw');
	var DrawStyle = require('agj/graphics/DrawStyle');
	var merge = require('agj/object/merge');
	var autoCurry = require('agj/function/autoCurry');


	var holeStyle = new DrawStyle().lineColor(0xff0000).lineWeight(3).lineAlpha(0.5);
	var pinStyle = new DrawStyle().fillColor(0x0000ff).fillAlpha(0.4);

	var drawHole = autoCurry( function (ctx, point) {
		draw.circle(ctx, holeStyle, merge(point, { radius: 5 } ));
	});
	var drawPin = autoCurry( function (ctx, point) {
		draw.circle(ctx, pinStyle, merge(point, { radius: 3 } ));
	});

	return {
		hole: drawHole,
		pin: drawPin,
	};

});

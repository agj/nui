
define( function(require) {
	'use strict';

	var log          = require('agj/utils/log');
	var draw         = require('agj/graphics/draw');
	var DrawStyle    = require('agj/graphics/DrawStyle');
	var flatten      = require('agj/array/flatten');
	var autoCurry    = require('agj/function/autoCurry');
	var is           = require('agj/is');
	var to           = require('agj/to');

	var SPY               = require('app/inspect');
	var map               = require('app/function/map');

	var beziers = autoCurry( function (canvas, bezierStrokes) {
		var ctx = canvas.getContext('2d');

		bezierStrokes
		.passTo(flatten(1))
		.forEach(drawBezier(ctx));
	});

	var drawBezier = autoCurry(function (ctx, points) {
		draw.curve.apply(null,
			[ctx, new DrawStyle().lineColor(0xfdb588).lineWeight(16).lineAlpha(1).lineCapsStyle('round')]
			.concat(points)
		);
	});

	return beziers;

});


define( function(require) {
	'use strict';

	var log          = require('agj/utils/log');
	var draw         = require('agj/graphics/draw');
	var DrawStyle    = require('agj/graphics/DrawStyle');
	var merge        = require('agj/object/merge');
	var first        = require('agj/array/first');
	var last         = require('agj/array/last');
	var autoCurry    = require('agj/function/autoCurry');
	var is           = require('agj/is');
	var to           = require('agj/to');

	var map               = require('app/function/map');
	var normalizePoint    = require('app/point/normalizePoint');

	var yarn = autoCurry( function (canvas, pointStrokes) {
		var ctx = canvas.getContext('2d');
		var normalizePointCanvas = normalizePoint({ width: canvas.width, height: canvas.height, x: 0, y: 0 });

		pointStrokes = pointStrokes
		.map(map(normalizePointCanvas));

		pointStrokes
		.reduce( function (prev, points) {
			drawLine(ctx, prev, first(points), false);
			return last(-1, points)
				.reduce( function (prev, point) {
					drawLine(ctx, prev, point, true);
					return point;
				}, first(points));
		}, merge(first(first(pointStrokes)), { x: -10 }));
	});

	function drawLine(ctx, pa, pb, over) {
		draw.line(ctx, new DrawStyle().lineColor(0x0066ff).lineWeight(5).lineAlpha(over ? 0.6 : 0.2).lineCapsStyle('round'), pa, pb);
	}

	return yarn;

});

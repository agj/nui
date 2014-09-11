
define( function(require) {
	'use strict';

	var log          = require('agj/utils/log');
	var draw         = require('agj/graphics/draw');
	var DrawStyle    = require('agj/graphics/DrawStyle');
	var first        = require('agj/array/first');
	var last         = require('agj/array/last');
	var autoCurry    = require('agj/function/autoCurry');
	var is           = require('agj/is');
	var to           = require('agj/to');

	var SPY               = require('app/inspect');
	var drawA             = require('app/draw/a');
	var map               = require('app/function/map');

	var holesAndPins = autoCurry( function (canvas, pointStrokes) {
		var ctx = canvas.getContext('2d');
		var drawHole = drawA.hole(ctx);
		var drawPin = drawA.pin(ctx);

		pointStrokes
		.forEach( function (points) {
			drawHole(first(points));
			drawHole(last(points));
			points.slice(1, -1).forEach(drawPin);
		});
	});

	return holesAndPins;

});

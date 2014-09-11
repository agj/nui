
define( function(require) {
	'use strict';

	var log          = require('agj/utils/log');
	var autoCurry    = require('agj/function/autoCurry');
	var is           = require('agj/is');
	var to           = require('agj/to');

	var rawToBeziers     = require('app/stroke/rawToBeziers');
	var beziersToPoints  = require('app/stroke/beziersToPoints');
	var drawBeziers      = require('app/draw/beziers');
	var drawHolesAndPins = require('app/draw/holesAndPins');
	var drawYarn         = require('app/draw/yarn');

	var doDraw = autoCurry( function (canvas, strokes) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var bezierStrokes = rawToBeziers(strokes);
		var pointStrokes = beziersToPoints(bezierStrokes);

		drawBeziers(canvas, bezierStrokes);
		drawHolesAndPins(canvas, pointStrokes);
		drawYarn(canvas, pointStrokes);
	});

	return doDraw;

});

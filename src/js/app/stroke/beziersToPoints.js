
define( function(require) {
	'use strict';

	var log        = require('agj/utils/log');
	var flatten    = require('agj/array/flatten');
	var to         = require('agj/to');
	var autoCurry  = require('agj/function/autoCurry');

	var map                   = require('app/function/map');
	var normalizePoint        = require('app/point/normalizePoint');
	var expandBezier          = require('app/stroke/expandBezier');
	var removeEdgePoints      = require('app/stroke/removeEdgePoints');
	var joinEnds              = require('app/stroke/joinEnds');
	var removeRedundantPoints = require('app/stroke/removeRedundantPoints');
	var unifyRedundantPins    = require('app/stroke/unifyRedundantPins');

	var beziersToPoints = autoCurry(function (dimensions, bezierStrokes) {
		return bezierStrokes
			.map(map(expandBezier(5)))
			.map(removeEdgePoints)
			.map(flatten)
			.map(removeRedundantPoints)
			.passTo(unifyRedundantPins)
			.map(map(normalizePoint({ x: dimensions.width, y: dimensions.width })))
			.passTo(joinEnds);
	});

	return beziersToPoints;

});

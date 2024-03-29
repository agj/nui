
define( function (require) {
	'use strict';

	var λ = require('app/lambda');

	var first   = require('agj/array/first');
	var last    = require('agj/array/last');
	var flatten = require('agj/array/flatten');
	var within  = require('agj/array/within');
	var seq     = require('agj/function/sequence');
	var bound   = require('agj/object/bindMethod');
	var log     = require('agj/utils/log');
	var to      = require('agj/to');
	var is      = require('agj/is');

	var cfg      = require('app/configuration');
	var distance = require('app/point/distance');
	var unique   = require('app/array/unique');
	var SPY      = require('app/inspect');

	var xSPY = to.id;

	function unifyRedundantPins(strokes) {
		var pins = flatten(strokes.map(to.call('slice', [1, -1])));
		return strokes.map( function (points) {
			if (points.length <= 2) return points;
			var isHole = within([first(points), last(points)]);
			return points.map( function (pin) {
				if (isHole(pin)) return pin;
				var neighbors = pins.filter(isNear(pin));
				if (neighbors.length <= 1) return pin;
				neighbors = neighbors.map( seq(isNear, bound(pins, 'filter')) ).passTo(flatten).passTo(unique);
				return midPoint(neighbors);
			});
		});
	}

	function isNear(point) {
		return seq(distance(point), λ('/' + cfg.SVG_SIZE), is.lt(1 / 16));
	}

	function midPoint(points) {
		return {
			x: points.map(to.prop('x')).reduce(λ('a + b')) / points.length,
			y: points.map(to.prop('y')).reduce(λ('a + b')) / points.length,
		};
	}

	return unifyRedundantPins;

});

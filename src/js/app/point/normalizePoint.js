
define( function (require) {
	'use strict';

	var λ = require('app/lambda');

	var mapObj = require('agj/object/map');
	var log    = require('agj/utils/log');

	var cfg = require('app/configuration');

	function normalizePoint(target) {
		var widthFactor = target.width / cfg.SVG_SIZE;
		var heightFactor = target.height / cfg.SVG_SIZE;
		var xOffset = target.x;
		var yOffset = target.y;
		return function (pt) {
			return {
				x: pt.x * widthFactor  + xOffset,
				y: pt.y * heightFactor + yOffset,
			};
		};
	}

	return normalizePoint;

});

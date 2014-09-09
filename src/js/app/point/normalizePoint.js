
define( function (require) {
	'use strict';

	var λ = require('app/lambda');

	var mapObj = require('agj/object/map');

	function normalizePoint(target) {
		target = mapObj(target, λ('/109'));
		return function (pt) {
			return { x: pt.x * target.x, y: pt.y * target.y };
		};
	}

	return normalizePoint;

});

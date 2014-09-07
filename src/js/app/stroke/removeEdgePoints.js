
define( function (require) {
	'use strict';

	var first = require('agj/array/first');
	var last = require('agj/array/last');

	function removeEdgePoints(beziers) {
		if (beziers.length <= 1) return beziers;
		return [first(beziers).slice(0, -1)]
			.concat(
				beziers.slice(1, -1).map( function (points) {
					return points.slice(1, -1);
				})
			)
			.concat([last(beziers).slice(1)]);
	}

	return removeEdgePoints;

});

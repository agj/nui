
define( function (require) {
	'use strict';

	var lazy = require('lazy');

	var last = require('agj/array/last');
	var argumentizeReduce = require('app/function/argumentizeReduce');

	function strokeToBeziers(stroke) {
		return lazy(stroke)
			.consecutive(2)
			.reduce( argumentizeReduce(function (r, ia, ib) {
				if (ib.command === 'c') {
					return r.concat( [last(1, ia.coords).concat(ib.coords)] );
				}
				return r;
			}), []);
	}

	return strokeToBeziers;

});

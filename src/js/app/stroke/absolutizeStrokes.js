
define( function (require) {
	'use strict';

	var offsetPoint = require('app/point/add');
	var merge = require('agj/object/merge');
	var last = require('agj/array/last');

	function absolutizeStrokes() {
		var pos = { x: 0, y: 0 };
		return function (stroke) {
			return stroke.map( function (instr) {
				instr = merge({}, instr);
				if (!instr.absolute) {
					instr.coords = instr.coords.map(offsetPoint(pos));
				}
				instr.absolute = true;
				pos = last(instr.coords);
				return instr;
			});
		};
	}

	return absolutizeStrokes;

});
